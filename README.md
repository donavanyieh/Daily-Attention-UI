# A daily research paper aggregator site
<img width="1901" height="953" alt="image" src="https://github.com/user-attachments/assets/25583a2c-0edf-4e5a-aea0-cdf1bb08d81f" />

Part 1 of my dream of deploying a Research Paper Aggregator site. The idea is to scrape research papers daily and summarize key points. Probably been done before, but it's in a format I like. Sweet and simple, showing summary, key points, tags.

# Motivation
Automate parts of my day where I browse arxiv and huggingface daily papers to help me keep up to date with latest trends

# What's next
This is just part 1 - the UI. Next steps comes with me setting up with actual scraping and processing (generate summary, key points, tags etc). Should be a cron job to a database, where this will read from there. Will push the backend once it's in a good place.
This app uses mock data for now on an sqlite instance. Check out setup

# Setup
1. Just pull the repo
2. Set up database
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
