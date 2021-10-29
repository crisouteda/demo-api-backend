# Creator search backend

This serverless app is used to allow interaction between our library frontend and our api.
The apikeys used are on ssm, frontend only needs to specify environment (prod or staging, see below)

## Endpoints

### `getVoices` and `getTemplates`

This endpoint returns voices or templates, already filtered.

- Path: `/getVoices` and `/getTemplates`
- Method: `POST`
- Body parameters:
  - `debug`: true on staging, `false` on prod
  - `filters`: object containing key-value pairs that are in line with allowed filtering parameters

### `getRandomScript`

This endpoint returns a randon script

- Path: `/getRandomScript`
- Method: `POST`
- Body parameters:
  - `debug`: true on staging, `false` on prod
  - `category`: (string) name of the category from which the random text is retrieved.

### `getAudio`

This endpoint returns voices or templates, already filtered.

- Path: `/getAudio`
- Method: `POST`
- Body parameters:
  - `debug`: true on staging, `false` on prod
  - `scriptText`: string with the text to produce
  - `soundTemplates`: string with the soundTemplate Name
  - `voice`: string with the alias or voiceName of the speaker

## Deployment

staging:

```
sls deploy
```

prod:

```
sls deploy -s prod
```
