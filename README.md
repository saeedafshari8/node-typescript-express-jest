# Movie Metadata Search

## Preface

Hello,

this is part of your interview with Joyn that aims to test your ability to write services that efficiently solve problems we have in our business.

Please read this document carefully before starting, as it outlines your task, the constraints and by what criteria you will be evaluated.

Use git to document your work. When finished, please create a pull request on the `master` branch, according to the following naming convention: `<your name>-solution`

We will look at the git history of your pull request to determine the way you approached this. **Please do not squash commits or bundle many unrelated changes into one large commit.**

## The service

You are tasked to implement a RESTful API that provides the following two basic functionalities to retrieve movie metadata from a content catalogue.

The data used for this comes from two sources:

- Typically, our own movie data would come from a database, but to simplify this, we use the static json files in `./movies` as our content catalogue.
- OMDb movie metadata can be retrieved as follows:
  - `https://www.omdbapi.com/?i=<imdb movie id>&apikey=<apikey>&plot=full`
  - You can use the following API key: `68fd98ab` (Limited to 1000 requests per day)
  - Please see https://www.omdbapi.com for details

#### Getting enriched movie metadata (title, description, ..)

The first task is to merge movie metadata from our systems with movie metadata from the Open Movie Database (OMDb).

- Calling `GET /api/movies/:id` should return a JSON object representing the merged movie object.
- `:id` is an alphanumeric value that can either refer to OMDb movie ids or our internal ids.
- When merging the two objects with the same fields (i.e. both JSON objects have a `title` / `Title`), it depends on the name of the field, which metadata should be used.
- The following rules apply, with capitalized field names (i.e. `Title` vs `title`) always referring to OMDb data
  - `Title` overwrites `title`
  - `Plot` overwrites `description`
  - `duration` overwrites `Runtime`
  - `userrating` will become part of `Ratings`, applying a similar logic than `Ratings` currently has
  - `Director`, `Writer` and `Actors` should be transformed from `String` to an `String[]`
- Fields not covered by any of these rules should be merged into the resulting JSON in a normalized way
- If fields are unclear, make reasonable assumptions and choose your implementation accordingly

#### Search movies in our catalogue

We want to be able to search movies in our catalogue. To that end, we implement a simple search that returns a movie object if **all** search terms are true. A search term is a query param in your REST call in the form of `<search_field>=<search value>`

- If no search term is provided, return all movies
- Search terms are **case-insensitive**
- Search is performed on the merged json objects of movies
- If `<search_field>` is of type `Number` or `String` in the movie metadata, the search matches if the values are equal, i.e. `?title=Sin City` matches `3532674.json`
- If `<search_field>` is of type `Array` in the movie metadata, the search matches if the `<search value>` is contained in the array, i.e. `?director=Frank Miller` matches `3532674.json` / the corresponding OMBd object
- Calling `GET /api/movies?<search_field>=<search value>` should return a JSON array representing all movies that match the search criteria

## Additional Tasks

The following tasks are optional but it would be nice to have at least one, in case you have additional time.

### TypeScript

Setup the project using TypeScript.

### AWS Lambda Function

Use the code you have written and create an [AWS Lambda function](https://aws.amazon.com/lambda/).
For setting up the Lambda function and the deployment please use [IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code).
You are free to use any framework or tool for this task.

### Caching

To improve response times it might be beneficial to add caching to the service. Go through your implementation and check where adding caching would make sense. Then pick an appropriate caching mechanism and implement it in your code. Please also take [TTLs](https://en.wikipedia.org/wiki/Time_to_live) and application scaling into account.

## Constraints

- Use node.js in version 12+
- Use ES7 or newer
- Do not introduce any system dependencies (databases, caches, search engines, docker, ..) to solve this task. This task is about your problem solving skills and not about creating a production ready system. It should not require more than `npm install` and `npm start` to have a running service.
- 72h after being added to the project, your pushing rights will be revoked and the latest commit of your implementation will be the basis for your evaluation.
- We respect your time and encourage you to keep it simple: You are not expected to spend days on this - just proof that you know how to write great software in node.js

## Evaluation criteria

In general you can think of the evaluation being a thorough peer review of your code.
You will be evaluated by a number of criteria, among others:

- How well did you apply engineering best practices (general & node.js specific)?
- Is the service working as intended?
- How readable is your code?
- Does the service solve the problem
  - correctly?
  - efficiently?
- Is your code consistent in itself (styling, language constructs, ..)?
- Appropriate use of 3rd party modules
- We do **not** expect you to have a high test coverage, **BUT** it is important that you demonstrate that you know how to write testable code and provide a few tests that showcase this.
- Proper use of git
- Making good assumptions and documenting them

## Questions

If you have any further questions, please open an issue in this GitHub repository and we'll try to give you an answer as quickly as possible.

### Good luck

### Solution

In order to compile and run the project, after cloning it from the repository, run the following command:

`npm install`

## npm run devStart

This command should be used to launch the application in local-machine.

## npm run build

This command builds compiles ts files to js files and puts them inside build folder.

## npm run lint

This command prettifies and checks the source files styling.

## npm run lint

This command runs all unit tests and creates code coverage reports inside coverage folder.
