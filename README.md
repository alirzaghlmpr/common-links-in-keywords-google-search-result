# common links in keywords google search result
## description
this node js app will scrap the first page of google result for a list of queries and then extract which pages appear in every keyword of the list of keywords in the google search result(page 1) and save them to a json file.
##useage
suppose that you want to check which pages in google result are in top via these keywords:

`["buy shoes","buy men shoes"]`

this program will extract all link in search result and also categorized pages which are common in search result of the keywords lists.

## how to run
after clone or download , open terminal and do these steps

`npm i`

`node main.js`

## how to input keywords
in line 5 of program , just add as much as keyword you want in the array

`const keywords = ["keyword 1","keyword 2"];`
