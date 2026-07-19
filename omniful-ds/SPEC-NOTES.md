
# Omniful DS — extracted spec (from Figma file)

## Already materialized
- omniful-ds/tokens/fig-tokens.css  (55 tokens: spacing 0-56, radius 0-64+full, CTA heights 40/36/24, CTA radius 8/6/4, CTA font 14/12/11, CTA icon 20/16/12, strokes 1/2/4/6, text-field-radius 8)
- omniful-ds/icons/icon-data.js (202 icons, currentColor), Icon.jsx, Icon.d.ts

## Colors (exact, from /Colors page)
Primary #5468FA · Light #CCD2FD (strokes) · Lighter #EEF0FE (bg/disabled) · Dark #495AD9 (pressed)
Text: Primary #222222 · Secondary #666666 · Tertiary #999999
Surfaces: Pure White #FFFFFF · Canvas #F4F5F7 · Dividers #EEEFF2 · Bg2 #F9F9F9 · Search bg #FAFAFA
Inputs: text-grey #B1B1B1 · border #DEDEDE · disabled bg #F4F4F4 · disabled text #C9C9C9
Accents (fg/bg): Red #C21808/#FFE5E5 · Orange #F9720A/#FEE3CE · Green #067603/#E6F1E6 · Purple #AE1AF7/#F7E8FE · Cyan #00CFE8/#E5FCFF · Brown #CD5700/#FFFAEA
(usage: tags & tag backgrounds; error red also rgb(244,37,0)=#F42500 in states)

## Typography (Poppins; line-height = size × 1.5)
H1 28 (R/M/SB, lh42) · H2 20 (lh30) · H3 16 (lh24) · Body 14 (R/M/SB, lh~21)
SubBody 12 · Assistive 11 · also 18 and 10 in use. Paragraph spacing = size × 1.5.

## Buttons (guidance from file)
- One primary CTA per area. 12px gap between buttons in a row.
- Use buttons for actions, links for navigation. Avoid disabled buttons in forms.
- Sizes (CTA tokens): Regular h40 r8 fs14 icon20 · Compact h36 r6 fs12 icon16 · Compressed h24 r4 fs11 icon12
- Families: Primary_button (20/15/14 states), Small_, Compact_, Icon Button (8 states), Icon button_Secondary, Split button, Line_Split button, 24/36 icon buttons.

## Still to read for exact values (todo 40)
Input-fields, Check-Box, Radio-Button, Toggle, Chips, Dropdowns, Tabs, Toast, Banner,
Tags-Badge-Label, Pagination, Stepper, Side-Sheet, Vertical-Navigation, Table-Rows-Columns,
Segmented-Button, Search, Avatar, Note, Notifications, Modal-web-and-app, Pills, Dividers, Scroll, Inline-Edit
IGNORE: Dump, Thumbnail, Illustration (brand art, 153 frames), Tool-Tip-WIP, Apple Watch frames.

## Plan (user-approved answers)
- Both: case study page + full library. Homepage card 005. All standard components, skip junk.
- Fidelity: faithful but cleaned up. Real interactive states. Per-component "why" notes.
1. omniful-ds/library.html — interactive library (Poppins via Google Fonts, white canvas, left rail: Foundations / Inputs / Navigation / Feedback / Data). Each block: live demo + why-note.
2. project-design-system-omniful.html — case study in site idiom, links to library.
3. Card 005 on index.html + entry in projects-data.js (side sheet uses single-colour box + icon).
</content>
</invoke>

