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
  const [selectedSite, setSelectedSite] = useState('');
  const questionGroups = buildQuestionGroupsForSite(responses, selectedSite);
  const hasSelectedSite = selectedSite !== '';

  function handleExportPdf() {
    if (!hasSelectedSite) return;

    const printableContent = questionGroups
      .map(({ question, answers }) => {
        const answerList = answers
          .map((answer, index) => `<li>${String(answer).replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</li>`)
          .join('');
        return `
          <section class="print-question-block">
            <p class="print-question">${String(question).replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p>
            <ol>${answerList}</ol>
          </section>
        `;
      })
      .join('');

    const popup = window.open('', '_blank');
    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>Feedback Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; line-height: 1.45; }
            h1 { font-size: 20px; margin-bottom: 6px; }
            p.meta { margin-top: 0; color: #444; }
            .print-question-block { margin-bottom: 14px; }
            .print-question { font-weight: 700; margin: 0 0 6px; }
            ol { margin: 0; padding-left: 20px; }
            li + li { margin-top: 4px; }
          </style>
        </head>
        <body>
          <h1>Feedback Responses</h1>
          <p class="meta"><strong>Site:</strong> ${selectedSite}</p>
          ${printableContent}
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  }

  return (
    <div className="App">
      <main className="content">
        <div className="top-row">
          <h1>Feedback Responses</h1>
          {hasSelectedSite && (
            <button type="button" className="export-btn" onClick={handleExportPdf}>
              Export PDF
            </button>
          )}
        </div>
        <label className="site-picker-label" htmlFor="sitePicker">
          Site
        </label>
        <select
          id="sitePicker"
          className="site-picker"
          value={selectedSite}
          onChange={(event) => setSelectedSite(event.target.value)}
        >
          <option value="">Select a site URL...</option>
          {siteUrls.map((siteUrl) => (
            <option key={siteUrl} value={siteUrl}>
              {siteUrl}
            </option>
          ))}
        </select>

        <section className="qa-list">
          {!hasSelectedSite && <p className="empty-state">Choose a site to view responses.</p>}
          {hasSelectedSite &&
            questionGroups.map(({ question, answers }) => (
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
