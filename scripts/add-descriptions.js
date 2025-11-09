#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read episodes.json
const data = JSON.parse(fs.readFileSync('../episodes.json', 'utf8'));

// Descriptions for each meeting based on attachments and typical board meeting content
const descriptions = {
  "meeting-01_unknown-date": "Discussion of annual statements, organizational budget, and compensation review. Board review of Clear Fund's scope and strategic direction as a new organization.",

  "meeting-03_unknown-date": "Review of events and organizational developments in early 2008. Discussion of operational procedures and organizational positioning.",

  "meeting-04_unknown-date": "Exploration of options for third and fourth cause areas. Review of preliminary strategic plan for 2008 research priorities.",

  "meeting-05_unknown-date": "Outline of organizational review process and planning framework. Discussion of 2008 strategic plan and research approach.",

  "meeting-06_unknown-date": "Budget review for May through December 2008. Approval of resolutions for banking account management and financial operations.",

  "meeting-07_unknown-date": "Professional development progress report and organizational vision document. Review of tactical plan, transition strategy, and budget update.",

  "meeting-08_unknown-date": "Overview of organizational financial situation. Discussion of key research methodology questions and miscellaneous operational matters.",

  "meeting-09_2009-03-31": "Financial situation review and proposal for new banking arrangements. Approval of corporate resolutions and updated research agenda.",

  "meeting-10_unknown-date": "Budget update, organizational progress, and priority-setting discussion. Review of professional development, proposed policies, bylaws amendment, and grant disbursement proposals.",

  "meeting-11_2009-12-29": "Review of economic empowerment grant proposal. Budget update and financial planning discussion.",

  "meeting-12_2010-03-03": "Annual review including 2009 metrics report and 2010 work plan. Discussion of 2010 compensation review, insurance coverage, and outreach strategies.",

  "meeting-13_2010-07-14": "Organizational progress report and priority-setting. Budget update and financial planning for remainder of 2010.",

  "meeting-14_2010-12-14": "Board meeting covering organizational updates and planning. Discussion of operational matters and strategic direction.",

  "meeting-15_2011-04-11": "Annual review including 2010 unaudited financials and 2011 budget. Insurance coverage review, compensation analysis with salary survey, and board member ballot.",

  "meeting-16_2011-08-17": "Financial situation update and organizational progress report. Research methodology updates and program developments.",

  "meeting-17_2011-12-20": "Year-end progress report and planning for 2012 priorities. Discussion of organizational developments and strategic direction.",

  "meeting-18_2012-03-28": "Annual review of 2011 activities and organizational formalities. Financial situation analysis, insurance review, and 2012 compensation review with salary survey data.",

  "meeting-19_2012-07-02": "Mid-year organizational update and strategic planning discussion. Review of research progress and operational developments.",

  "meeting-20_2012-08-09": "Strategic shift discussion regarding organizational focus and research approach. Review of operational changes and future direction.",

  "meeting-21_2013-01-24": "Quarterly board meeting covering organizational updates. Discussion of research progress and operational matters.",

  "meeting-22_2013-04-29": "Annual review of 2012 activities and accomplishments. Board member ballot and governance matters.",

  "meeting-23_2013-05-06": "Insurance coverage review and organizational formalities. Financial update and budget planning discussion.",

  "meeting-24_2013-08-14": "Financial update and fundraising policy review. Discussion of operational procedures and development strategy.",

  "meeting-25_2013-12-16": "Year-end board meeting reviewing organizational progress. Planning discussion for 2014 priorities and initiatives.",

  "meeting-26_2014-04-30": "Annual board meeting with general organizational update. Review of research progress and strategic planning.",

  "meeting-27_2014-08-18": "Budget and revenue forecasts with analysis of unrestricted revenue growth drivers. Executive compensation review and financial planning.",

  "meeting-28_2014-12-16": "Year-end organizational review and planning for 2015. Discussion of research priorities and operational developments.",

  "meeting-29_2015-03-12": "Quarterly board meeting with updates on organizational activities. Review of program developments and strategic initiatives.",

  "meeting-30_2015-06-17": "Comprehensive board meeting covering document retention policy, insurance review, and Open Philanthropy Project roles. Revenue forecasts, budget planning, and executive compensation review.",

  "meeting-31_2015-10-15": "Fall board meeting reviewing organizational progress and initiatives. Discussion of strategic priorities and operational updates.",

  "meeting-32_2016-03-21": "Annual board meeting with comprehensive organizational review. Discussion of research developments and planning for 2016.",

  "meeting-33_2016-06-14": "Mid-year board meeting covering multiple organizational topics. Review of financial position, strategic initiatives, and operational matters.",

  "meeting-34_2016-11-07": "Fall board meeting with organizational updates and planning discussion. Review of research progress and program developments.",

  "meeting-35_2017-03-27": "Spring board meeting covering organizational review and strategic planning. Discussion of research priorities and operational developments.",

  "meeting-37_2017-06-06": "Comprehensive mid-year board meeting with multiple attachments covering organizational topics. Review of financial position, strategic initiatives, and programmatic developments.",

  "meeting-38_2017-10-30": "Fall board meeting with extensive agenda covering organizational review. Discussion of financial planning, research progress, and strategic initiatives.",

  "meeting-39_2018-03-22": "Annual spring board meeting reviewing organizational progress. Discussion of research developments and strategic planning for the year.",

  "meeting-40_2018-06-18": "Mid-year comprehensive board meeting covering organizational operations. Review of financial position, research progress, and strategic initiatives.",

  "meeting-41_2019-04-30": "Spring board meeting with organizational review and planning discussion. Coverage of financial matters, research updates, and operational developments.",

  "meeting-42_2019-07-29": "Summer board meeting covering multiple organizational topics. Review of strategic initiatives, financial planning, and program developments.",

  "meeting-44_2020-02-27": "Early 2020 board meeting with organizational updates. Discussion of strategic direction and operational matters.",

  "meeting-45_2020-05-28": "Spring board meeting during COVID-19 pandemic period. Review of organizational adaptations, financial position, and strategic planning.",

  "meeting-46_2020-08-25": "Summer board meeting with responses to board member questions (redacted). Review of organizational progress, strategic initiatives, and operational developments.",
};

// Update episodes with descriptions
data.episodes.forEach(episode => {
  if (descriptions[episode.id]) {
    episode.description = descriptions[episode.id];
  } else {
    console.warn(`Warning: No description for ${episode.id}`);
  }
});

// Write updated file
fs.writeFileSync('../episodes.json', JSON.stringify(data, null, 2));

console.log(`✓ Updated ${data.episodes.length} episodes with descriptions`);
console.log(`✓ File saved to: episodes.json`);
