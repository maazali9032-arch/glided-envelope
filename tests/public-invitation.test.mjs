import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizePublicInvitation,
  readSlugFromPathname,
  publicUrl,
} from "../src/lib/public-invitation.ts";

test("slugs are pathname-only, safely decoded and reject malformed separators", () => {
  assert.equal(readSlugFromPathname("/arian-elara-03/"), "arian-elara-03");
  assert.equal(readSlugFromPathname("/ignored/final"), "final");
  assert.equal(readSlugFromPathname("/caf%C3%A9"), "café");
  for (const path of ["/", "", "/%E0%A4%A", "/%2F", "/%5C", "/%20"]) {
    assert.equal(readSlugFromPathname(path), null);
  }
});

test("fallback discards all wedding data; unknown/malformed states are errors", () => {
  assert.deepEqual(
    normalizePublicInvitation({
      state: "fallback",
      content: { groom_name: "Must not appear" },
      shop: { name: "Studio", secret: "ignored" },
    }),
    {
      kind: "fallback",
      shop: {
        name: "Studio",
        phone: undefined,
        whatsapp: undefined,
        address: undefined,
        city: undefined,
        business_contact: undefined,
      },
    },
  );
  assert.deepEqual(
    normalizePublicInvitation({ state: "not_found", content: { groom_name: "Ignored" } }),
    { kind: "not_found" },
  );
  for (const value of [
    null,
    [],
    {},
    { state: "draft" },
    { state: "live", content: [] },
    { data: { data: { state: "live", content: {} } } },
  ]) {
    assert.deepEqual(normalizePublicInvitation(value), { kind: "error" });
  }
});

test("live content tolerates absent fields and maps all profile fields", () => {
  const result = normalizePublicInvitation({
    data: {
      state: "live",
      content: {
        groom_name: "Arian",
        groom_qualification: "MBA",
        groom_occupation: "Designer",
        groom_parents: "Parents",
        relatives: "Family",
        bride_name: "Elara",
        events: {},
        gallery: null,
        contacts: "invalid",
      },
      shop: { name: "Studio", phone: "Shop phone" },
    },
  });
  assert.equal(result.kind, "live");
  assert.equal(result.config.brandName, "Studio");
  assert.equal(result.config.groomProfile.qualification, "MBA");
  assert.equal(result.config.groomProfile.occupation, "Designer");
  assert.equal(result.config.groomProfile.parents, "Parents");
  assert.equal(result.config.relatives, "Family");
  assert.deepEqual(result.config.contacts, []);
  assert.deepEqual(result.config.events, []);
  assert.deepEqual(result.config.gallery, []);
  assert.equal(result.config.countdownTarget, undefined);
  assert.equal(result.config.music.enabled, false);
});

test("contacts use only the first two objects and same-phone WhatsApp fallback", () => {
  const { config } = normalizePublicInvitation({
    state: "live",
    content: {
      contacts: [
        { name: "First", phone: "+91 90000 00000" },
        { name: "No phone", whatsapp_url: "https://wa.me/123" },
        { phone: "Third must be ignored" },
      ],
    },
  });
  assert.deepEqual(config.contacts, [
    { name: "First", phone: "+91 90000 00000", whatsappUrl: "https://wa.me/919000000000" },
  ]);
});

test("unsafe links/media are removed, aliases map and duplicate gallery URLs collapse", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "file:///private",
    "not a URL",
    "//example.com",
  ])
    assert.equal(publicUrl(url), undefined);
  const { config } = normalizePublicInvitation({
    state: "live",
    content: {
      maps_url: "javascript:alert(1)",
      music_url: "data:text/html,test",
      gallery: [
        null,
        42,
        "https://example.com/photo.jpg",
        { src: "https://example.com/photo.jpg" },
        { image_url: "javascript:alert(1)" },
      ],
      events: [
        null,
        [],
        {},
        {
          event_name: "Ceremony",
          event_date: "2027-12-14",
          start_time: "11:00",
          venue_name: "Hall",
          mapsUrl: "https://maps.google.com/",
        },
      ],
      wedding_date: "2027-12-14",
      start_time: "invalid",
    },
  });
  assert.equal(config.venue.mapsUrl, undefined);
  assert.equal(config.music.url, undefined);
  assert.equal(config.gallery.length, 1);
  assert.equal(config.events.length, 1);
  assert.equal(config.events[0].name, "Ceremony");
  assert.equal(config.countdownTarget, undefined);
});
