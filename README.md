# Advent of Code Data Fetcher CLI

Are you tired of copying and pasting data from the browser into a file every single day during the month of December? Well, do I have a CLI for you.

## Setup

In order to install this command globally on your machine please run the following command.

```
npm install && npm install -g
```

Next, you will need to create a file in the root of this directory called `auth.json` that looks like

```json
{
  "cookie": "your-cookie-here"
}
```

To find the cookie that will authorise the fetching of your data from Advent of Code, do the following:

1. Open a browser and navigate to the page containing the data set for any of the days
2. Open up dev tools and navigate to the network type
3. Locate the request headers, copy the value on the `cookie` header and paste it onto the key of `"cookie"` in your `auth.json` file.

Now you're good to go! **Note**: your cookie may change year-to-year, but that is a long time away so no worries eh?

## Using the command

The command will now be executable as `fetch-advent` and will accept **three** arguments: the year (integer), the day in December (integer) and a filepath. An example usage would look like:

```
fetch-advent 2021 4 some-data.txt
```

## Tests

You can run the tests with `npm test` but I know none of you test during Advent of Code so don't start pretending you care all of a sudden.
