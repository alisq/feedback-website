import './App.css';
import responses from './data/responses.json';
import { useState } from 'react';

const SITE_URL_FIELD = 'Site URL';

function isQuestionField(fieldName) {
  return fieldName !== SITE_URL_FIELD;
}

function getSiteUrls(items) {
  return [...new Set(items.map((item) => item[SITE_URL_FIELD]).filter(Boolean))];
}

function buildQuestionGroupsForSite(items, selectedSite) {
  const siteResponses = items.filter((item) => item[SITE_URL_FIELD] === selectedSite);

  const questionOrder = [];
  siteResponses.forEach((item) => {
    Object.keys(item)
      .filter(isQuestionField)
      .forEach((question) => {
        if (!questionOrder.includes(question)) {
          questionOrder.push(question);
        }
      });
  });

  return questionOrder
    .map((question) => {
      const answers = siteResponses
        .map((item) => item[question])
        .filter((answer) => answer !== undefined && answer !== null && `${answer}`.trim() !== '')
        .map((answer) => `${answer}`);

      return { question, answers };
    })
    .filter((entry) => entry.answers.length > 0);
}

function App() {
  const siteUrls = getSiteUrls(responses);
  const [selectedSite, setSelectedSite] = useState(siteUrls[0] || '');
  const questionGroups = buildQuestionGroupsForSite(responses, selectedSite);

  return (
    <div className="App">
      <main className="content">
        <h1>Feedback Responses</h1>
        <label className="site-picker-label" htmlFor="sitePicker">
          Site
        </label>
        <select
          id="sitePicker"
          className="site-picker"
          value={selectedSite}
          onChange={(event) => setSelectedSite(event.target.value)}
        >
          {siteUrls.map((siteUrl) => (
            <option key={siteUrl} value={siteUrl}>
              {siteUrl}
            </option>
          ))}
        </select>

        <section className="qa-list">
          {questionGroups.map(({ question, answers }) => (
            <article key={question} className="qa-item">
              <h2>{question}</h2>
              <ol>
                {answers.map((answer, index) => (
                  <li key={`${question}-${index}`}>{answer}</li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
