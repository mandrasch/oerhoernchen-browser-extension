Firefox: https://addons.mozilla.org/de/firefox/addon/oerh%C3%B6rnchen/

Chrome: https://chrome.google.com/webstore/detail/oerh%C3%B6rnchen/oojclmchomjdmmgjcfgekmbanplfmgel?hl=de




-------

2DO: Clean this up :)


PRIVACY VERSION

=> only open if user clicks on button
- only active tab permission needed...

https://developer.chrome.com/extensions/activeTab

2DO: move everything to popup.js

// 2DO: finish google web filtering... split up both functions...

Icon:
https://openclipart.org/detail/241327/squirrel-profile


2DO: special case --> https://www.google.de/imghp?hl=de

2DO: Detect if filter was successfully set before (e.g. reopen plugin popup after filter action)



# Test cases:

## Google Image Search

### CC BY-ND Image

1. Google image search: "Anna-Lena König re:publica 2018 41858854692" (CC BY-ND)
https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re:publica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1

2. CC0/BY/SA: https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re%3Apublica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1&tbs=sur%3Afmc --> no results (correct)

3. Include NC, uncheck ND: https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re%3Apublica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1&tbs=sur%3Afm --> no results (correct)

4. Uncheck NC, check ND: https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re%3Apublica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1&tbs=sur%3Afc --> 1 result (correct)

5. Check NC, check ND: https://www.google.de/search?q=Anna-Lena+K%C3%B6nig+re%3Apublica+2018+41858854692&hl=de&tbas=0&tbm=isch&tbas=0&source=lnt&sa=X&ved=0ahUKEwj9_uzM3prhAhUD1uAKHYvaApIQpwUIIA&biw=1091&bih=630&dpr=1&tbs=sur%3Af --> 1 result (correct)

(When NC/ND is checked, CC BY images will also appear in Google Images)

