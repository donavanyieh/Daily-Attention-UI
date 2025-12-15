# Daily Attention: TLDR of Daily AI developments in research 
<img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/67125b64-9f7a-48b5-ab87-511fb466825d" /><br>
Part 1 of my dream of deploying a Research Paper Aggregator site. The idea is to scrape research papers daily and summarize key points. Probably been done before, but it's in a format I like. Sweet and simple, showing:
<ul>
<li>Summary</li>
<li>Key points</li>
<li>Why this matters</li>
<li>Tags</li>
</ul>
<b>This is the UI part, and hence all mock data. Part 2 will be the backend, in another repo.</b><br><br>
<b>Update: Local sqlite DB is now deprecated in the current version.</b> You have to pull a previous commit version to use init_db. Latest version reads from Google BigQuery

# Motivation
Automate parts of my day where I browse arxiv and huggingface daily papers to help me keep up to date with latest trends

# What's next
This is just part 1 - the UI. Next steps comes with me setting up with actual scraping and processing (generate summary, key points, tags etc). Should be a cron job to a database, where this will read from there. Will push the backend once it's in a good place.
This app uses mock data for now on an sqlite instance. Check out setup

# Access
I'm trying out deployments with [Render](https://render.com/)<br>
Link is over here: [Daily Attention deployed on Render](https://daily-attention.onrender.com/)
<br><br>
Might be a little slow since I'm on free tier.<br>
<b>If inaccessible, I likely suspended deployments to not exceed free tier.</b>

# Setup
1. Just pull the repo
2. Set up database <b>IMPT: This step is now deprecated. Latest version uses Google BigQuery</b>. Pull an older version to use local sqlite.
```bash
python database/init_db.py
```

3. Build the app
```bash
npm install
npm run build
npm run start
```
4. (Alternatively)
```bash
npm install
npm run dev
```
If there are errors and you are on a windows OS, use:
```bash
npm install -g win-node-env
```

# Disclaimer
UI is vibe coded, I can't guarantee scalability or code cleanliness. You have to define your own db, either locally, or using BigQuery. Either way, it's your own DB, and I have no access to it.
