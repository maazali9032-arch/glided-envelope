# The Gilded Envelope

BUILD — ENVELOPE UNSEAL CINEMATIC WEDDING INVITATION



Create a single-page, mobile-first luxury digital wedding invitation whose central interaction is a realistic 3D envelope opening and letter unfolding experience.



Use React + TypeScript + Tailwind CSS + Framer Motion/Motion. Build a real working interactive webpage, not a static mockup.



Do NOT build an admin dashboard, authentication, database, SaaS or payment system.



1. INITIAL SCREEN — SEALED ENVELOPE



On first load, show a full-screen elegant wedding stationery scene.



Center a premium envelope vertically on the screen.



The envelope should look physical and dimensional, with:



- ivory/cream paper texture

- subtle paper grain

- layered envelope construction

- realistic shadows

- folded flap

- subtle depth

- elegant gold detailing

- monogram/wedding crest



Place a luxurious wax seal in the center of the flap.



Example:



A & A



Below the envelope:



TAP TO OPEN



The composition should resemble an expensive physical wedding invitation photographed in a luxury editorial setting.



Use soft warm lighting and subtle floating dust particles.



---



2. WAX SEAL INTERACTION



When the user taps the envelope:



1. "TAP TO OPEN" fades away.

2. Envelope subtly moves toward the viewer.

3. Wax seal gives a tiny tactile press/bounce.

4. Seal cracks/splits with a refined micro-animation.

5. Small fragments/glints disappear.

6. Envelope flap begins opening.



The seal animation should be elegant—not cartoonish.



---



3. ENVELOPE OPENING



Animate the top flap rotating upward realistically.



Use appropriate:



- perspective

- transform-origin

- 3D rotation

- shadows

- layered elements



As the flap opens, reveal the invitation card inside.



The paper should appear to have real thickness/depth.



Do not simply fade the invitation in.



It must visually emerge from inside the envelope.



---



4. LETTER EMERGENCE



After the flap opens:



The invitation card slowly slides upward from inside the envelope.



Pause briefly at the fully revealed position.



Then transition into the main invitation.



Use:



- translateY

- scale

- opacity

- subtle perspective

- shadow changes



The motion should feel like a physical card being pulled out.



---



5. UNFOLDING INVITATION



The revealed card becomes the main invitation.



Create the illusion of a folded luxury wedding letter unfolding vertically.



As the visitor scrolls, each section reveals itself like another fold opening.



The sections should feel physically connected rather than like unrelated website sections.



Use subtle:



- fold shadows

- paper texture

- edge highlights

- perspective

- rotation

- depth

- masked reveals



Avoid excessive 3D effects that make the page difficult to read.



---



6. FIRST REVEAL — INVOCATION



The first unfolded panel displays the spiritual/religious opening.



Example:



بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ



But make this configurable later to support:



- Allah

- Om

- Jesus

- Ram

- Custom

- None



Support Arabic, Urdu, Hindi, English and Unicode.



Correctly support RTL layouts.



---



7. COUPLE REVEAL



The next unfolding section reveals:



AHMED



&



AYESHA



14 DECEMBER 2026



Names should use luxurious wedding typography.



Reveal them sequentially after the paper unfolds.



Use:



- blur-to-sharp

- opacity

- slight scale

- subtle upward movement



Keep animation elegant and slow.



---



8. WEDDING MESSAGE



Reveal a refined invitation message.



Example:



Together with their families



Ahmed & Ayesha



invite you to celebrate their special day



Use generous whitespace and delicate ornamental details.



---



9. SCROLL-DRIVEN FOLD EXPERIENCE



The rest of the invitation should continue as the user scrolls.



Each major section should feel like another portion of the physical letter/card is unfolding.



Use scroll-linked animation for:



- panel movement

- fold shadows

- image reveals

- typography

- decorative borders

- subtle perspective



Do not make every section rotate dramatically.



The physical-paper metaphor should remain believable.



---



10. EVENTS



Include multiple wedding events.



Example:



NIKAH



14 DECEMBER 2026

11:00 AM



Venue Name

Hyderabad



VIEW LOCATION



WALIMA



16 DECEMBER 2026

7:30 PM



Venue Name

Hyderabad



VIEW LOCATION



Support:



- event name

- date

- time

- venue

- address

- description

- Google Maps URL



Events should look like beautifully printed invitation content, not UI cards.



---



11. COUNTDOWN



Include a refined wedding countdown:



DAYS — HOURS — MINUTES — SECONDS



Integrate it into the paper design.



Do not use generic rounded timer cards.



---



12. PHOTO REVEAL



Include couple photographs as if they are printed photographs placed inside the invitation.



Use:



- overlapping photographs

- paper edges

- subtle shadows

- taped/photo-corner details where appropriate

- gentle parallax

- slow zoom

- elegant reveal



Clicking a photo should open a lightbox.



---



13. VENUE



Create an elegant venue panel containing:



VENUE NAME



Full address



Hyderabad



GET DIRECTIONS



Open the configured Google Maps URL.



---



14. RSVP + CONTACT



Create a final invitation panel with:



- Guest name

- Attending / Not attending

- Number of guests

- Message



Also support:



- WhatsApp

- Phone

- Instagram

- Facebook

- YouTube



Only show configured links.



---



15. MUSIC



Include optional background music.



Do not force autoplay with sound.



Use the initial OPEN INVITATION interaction to allow music to begin after user interaction.



Add a discreet fixed play/pause control.



Do not use copyrighted music from the reference video.



---



16. FINAL SEAL / CLOSING



At the end, create a beautiful final thank-you panel.



Example:



WITH LOVE



AHMED & AYESHA



THANK YOU FOR CELEBRATING WITH US



Bring back the visual language of the original envelope.



Optionally animate a small ornamental/wax-stamp motif into place around the final message.



Do NOT completely close the envelope over the content.



The final CTA should remain accessible.



---



17. VISUAL DIRECTION



The entire experience should feel like:



luxury wedding stationery + physical paper + cinematic motion design.



Use:



- ivory

- cream

- champagne

- antique gold

- deep neutral accents

- subtle paper texture

- elegant serif typography

- refined secondary typography

- thin ornamental borders

- realistic shadows

- restrained animation



Avoid:



- generic website cards

- SaaS styling

- neon colors

- excessive gradients

- cartoon effects

- excessive rounded corners

- gimmicky 3D



---



18. MOBILE-FIRST



Primary target:



360–430px portrait mobile screens.



Also support tablet and desktop.



On mobile, the envelope must remain large enough to feel impressive without being clipped.



No horizontal scrolling.



No overlapping text.



No broken 3D transforms.



Respect safe areas.



---



19. CONTENT ARCHITECTURE



Keep invitation information in a centralized typed object:



- names

- date

- invocation

- events

- venue

- gallery

- contact

- social links



Components must consume this data rather than hardcoding wedding information throughout the UI.



This allows the design to later connect to an admin system without rebuilding the invitation.



---



20. FINAL QUALITY BAR



The first 5 seconds should make the visitor feel:



“I am opening a real luxury wedding invitation.”



The envelope, wax seal, flap, card emergence and unfolding are the core experience.



Prioritize:



1. Physical realism

2. Envelope opening choreography

3. Paper depth and shadows

4. Typography

5. Scroll-driven unfolding

6. Mobile experience

7. Smooth performance



Do not add unrelated features.



Build the complete working single-page invitation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/03ad332e-ffa1-4769-8811-9d7f42e71fcb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
