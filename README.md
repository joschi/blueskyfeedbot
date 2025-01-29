# Blueskyfeedbot

Blueskyfeedbot is a bot that posts RSS feeds to Bluesky via GitHub Actions.

## Usage

1. Go to https://bsky.app/settings/app-passwords and add a new app password.

   - Name it whatever you want.
   - Save it and grab the app password.
     For security reasons, you won't be able to view this again.
     If you lose this app password, you'll need to generate a new one.

2. Create a new GitHub repository.
3. Go to your repository settings at `https://github.com/${YOUR_REPO}/settings/secrets/actions/new`, and add a new
   secret with the value of the access token.
4.  Add a file named `.github/workflows/blueskyfeedbot.yml` with the following content:

    ```yaml
    name: FeedBot
    on:
      schedule:
        # This will run every five minutes. Alter it using https://crontab.guru/.
        - cron: '*/5 * * * *'  
    jobs:
      rss-to-bluesky:
        runs-on: ubuntu-latest
        steps:
          - name: Generate cache key
            uses: actions/github-script@v6
            id: generate-key
            with:
              script: |
                core.setOutput('cache-key', new Date().valueOf())
          - name: Retrieve cache
            uses: actions/cache@v3
            with:
              path: ${{ github.workspace }}/blueskyfeedbot
              key: feed-cache-${{ steps.generate-key.outputs.cache-key }}
              restore-keys: feed-cache-
          - name: GitHub
            uses: 'joschi/blueskyfeedbot@v1'
            with:
              # This is the RSS feed you want to publish
              rss-feed: https://www.githubstatus.com/history.rss
              # Template of status posted to Bluesky (Handlebars)
              template: '{{item.title}} {{item.link}}'
              # This is your service URL (optional)
              service-url: https://bsky.social
              # This is the Bluesky username (example: username.bsky.social)
              username: ${{ secrets.BLUESKY_USERNAME }}
              # This is the app password you created earlier
              password: ${{ secrets.BLUESKY_PASSWORD }}
              # This is a path to the cache file, using the above cache path
              cache-file: ${{ github.workspace }}/blueskyfeedbot/cache.json
    ```

5. Commit and publish your changes.

## Status template

The status template (`status-template`) is using [Handlebars](https://handlebarsjs.com/) as template engine.

The action is passing in an instance of `FeedData` (field `feedData`) and the current `FeedEntry` (field `item`) into the template:

```typescript
export interface FeedEntry {
  link?: string;
  title?: string;
  description?: string;
  published?: Date;
}

export interface FeedData {
  link?: string;
  title?: string;
  description?: string;
  generator?: string;
  language?: string;
  published?: Date;
  entries?: Array<FeedEntry>;
}
```
