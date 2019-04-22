# OERhörnchen
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/oojclmchomjdmmgjcfgekmbanplfmgel.svg) ![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/oojclmchomjdmmgjcfgekmbanplfmgel.svg)

Firefox: (https://addons.mozilla.org/de/firefox/addon/oerh%C3%B6rnchen/)

Chrome: (https://chrome.google.com/webstore/detail/oerh%C3%B6rnchen/oojclmchomjdmmgjcfgekmbanplfmgel?hl=de)




-------


## PRIVACY VERSION

=> only open if user clicks on button
- only active tab permission needed...

https://developer.chrome.com/extensions/activeTab

## To Do
- [ ] Move everything to popup.js
- [ ] Finish google web filtering... split up both functions...
- [ ] Special case --> https://www.google.de/imghp?hl=de
- [ ] Detect if filter was successfully set before (e.g. reopen plugin popup after filter action)


Icon:
https://openclipart.org/detail/241327/squirrel-profile


# Test cases:

## Google Image Search

### CC BY-ND Image

1. **Google image search: "Anna-Lena König re:publica 2018 41858854692" (CC BY-ND)**<br>
[Demo Link](https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re:publica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1)

2. **CC0/BY/SA:** [Demo Link](https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re%3Apublica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1&tbs=sur%3Afmc) <br>
Output: no results (correct)

3. **Include NC, uncheck ND:** [Demo Link](https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re%3Apublica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1&tbs=sur%3Afm) <br>
Output: no results (correct)

4. **Uncheck NC, check ND:** [Demo Link](https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re%3Apublica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1&tbs=sur%3Afc) <br>
Output: 1 result (correct)

5. **Check NC, check ND:** [Demo Link](https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re%3Apublica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1&tbs=sur%3Af) <br>
Output: 1 result (correct)

(When NC/ND is checked, CC BY images will also appear in Google Images)

