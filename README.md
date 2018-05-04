# ProfitSocial Stat TGbot

HI! I'll help you make a telegram bot for ProfitSocial.

This bot:
1. Donwload .csv statistic for today/yesterday
2. Upload stat on Zoho sheets
3. Drop link in chat (today/yesterday - every 30 min)


How install:
1. You need account on <a href="heroku.com">heroku.com</a> and <a href="github.com">github.com</a>
2. Copy this repo on your github
3. Go to <a href="https://dashboard.heroku.com/new-app">https://dashboard.heroku.com/new-app</a> and create new app (add name, choose region)
4. Go to "Setting" your app and click "Reveal Config Vars", then add variables:
<br>PROFIT_LOGIN = ProfitSocial authorization mail
<br>PROFIT_PASSWORD = ProfitSocial authorization password
<br>TG_TOKEN = api token your telegram bot
<br>CHAT_ID = chat id in telegram, where bot will drop lins
<br>TZ = your Time Zone, example: Europe/Moscow (view all zones https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
5. Scroll down and click "Add buildpacks", insert this links
<br>https://github.com/heroku/heroku-buildpack-nodejs.git
<br>https://github.com/jontewks/puppeteer-heroku-buildpack
6. Go to "Deploy" tab and choose "Deployment method" > GitHub
7. Click "Enable Automatics Deploys", if you want update bot in the future
8. Click "Deploy branch" and wait deploy
9. Choose "Resourses" tab, then OFF "web" switcher and ON "worker" (logs in "More" > "View logs")
10. Add your bot in TG chat

WELL DONE!
