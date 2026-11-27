# AI writing tells and humanization

Apply this file to prose a person will submit: papers, responses, abstracts, and repository docs. Keep equations, identifiers, and cited numbers as they are.

## Banned marker words

Delete these when they do not name a technical object: delve, leverage, tapestry, realm, pivotal, underscore, showcase, intricate, multifaceted, vibrant, landscape (as a metaphor), robust (with no number), comprehensive, cutting-edge, innovative.

Delete these openers: "It is worth noting", "In conclusion", "Overall", "Moreover" used as a tic, "Furthermore" stacked on the previous sentence, "This serves as", "Not only ... but also", "In the realm of".

## Sentence shape

1. Break triadic adjective strings. Keep the one adjective that changes a design choice.
2. Restore burstiness. A short sentence after a long one is normal. Three sentences of equal length and equal rhythm are a tell.
3. One number per sentence when the sentence is a result. Put the comparison in the next sentence.
4. Use a period, a comma, a colon, or parentheses. Do not use an em dash.

## Claim and evidence

Rebuild a results paragraph in this order:

1. Claim: quantity, value, unit, and the file or figure that holds it.
2. Check: mesh, element, boundary conditions, and the comparison case.
3. Limit: the material range, geometry class, load type, or mesh level the claim does not cover.

If step 1 has no file, the paragraph is not ready.

## Modeling limitations

State the limitation as a fact about the model. "The shell is linear elastic, so the load factor is not a collapse load." Put that sentence next to the load factor. Do not collect limits in a final paragraph that the results never point to.
