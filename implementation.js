async function makeRequest(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}. Please check the URL or try again later.`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Oops! Something went wrong while fetching data. Please try again later.");
    }
}

async function makeThrottledRequests(requests, delay = 66) {
    const results = [];
    for (let i = 0; i < requests.length; i++) {
        const result = await requests[i]();
        results.push(result);
        if (i < requests.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return results;
}


async function fetchTopAnswersThrottled(questionIds, stackExchangeKey) {
    const requests = questionIds.map(id => () =>
        makeRequest(`https://api.stackexchange.com/2.3/questions/${id}/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody&key=${stackExchangeKey}&pagesize=3`)
    );
    return await makeThrottledRequests(requests);
}

const checkIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.08-.02L10.9 7.5a.75.75 0 0 0-1.08-1.04L7.5 9.42 6.14 8.04a.75.75 0 1 0-1.08 1.04l1.91 1.95z"/>
    </svg>
`

const stackOverflowLogoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="margin-right: 4px;" viewBox="0 0 32 32"><path d="M28.16 32H2.475V20.58H5.32v8.575h19.956V20.58h2.884z" fill="#bcbbbb"/><path d="M8.477 19.8l13.993 2.923.585-2.806-13.993-2.923zm1.832-6.704l12.94 6.04 1.208-2.572-12.94-6.08zm3.586-6.353l10.99 9.12 1.832-2.183-10.99-9.12zM20.99 0l-2.3 1.715 8.536 11.46 2.3-1.715zM8.166 26.27H22.43v-2.845H8.166v2.845z" fill="#f48024"/></svg>
`

const fontStyles = `
    font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
`

const codeFontStyles = `
    font-family: ui-monospace,"Cascadia Mono","Segoe UI Mono","Liberation Mono",Menlo,Monaco,Consolas,monospace;
`

// Number formatting function
function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}

// Function to format date into a human-readable string in English
function formatDateString(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to create and style code blocks
function styleCodeBlocks(element) {
    // Find all <pre> and <code> elements within the element
    const preElements = element.querySelectorAll("pre");
    const codeElements = element.querySelectorAll("code");

    // Style <pre> blocks (code blocks with scrollable content)
    preElements.forEach(pre => {
        pre.style.cssText = `
            ${codeFontStyles}
            background-color: #f6f6f6;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #ddd;
            overflow-x: auto; /* Enables horizontal scrolling */
            line-height: 1.5;
            max-width: 100%;
        `;
    });

    // Style <code> elements (inline code snippets)
    codeElements.forEach(code => {
        // Check if the <code> element is inside an <a> (anchor) tag
        const isInsideLink = code.closest("a");

        // Apply default styling, but preserve link color if inside an <a> tag
        if (isInsideLink) {
            code.style.cssText = `
                ${codeFontStyles}
                background-color: #f6f6f6;
                padding: 2px 4px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 400;
                text-decoration: none; /* Keep the text decoration as is for links */
            `;
        } else {
            // Apply full styling for non-linked code blocks
            code.style.cssText = `
                ${codeFontStyles}
                background-color: #f6f6f6;
                color: #0c0d0e;
                padding: 2px 4px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 400;
            `;
        }
    });
}

function styleOutlineButtonWithIcon(element, text, iconSVG) {
    element.innerHTML = `${iconSVG ?? ""} ${text}`;
    element.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        color: #2563eb;
        text-decoration: none;
        border: 1px solid #2563eb;
        border-radius: 6px;
        background-color: transparent;
        font-size: .875rem;
        line-height: 1.25rem;
        font-weight: bold;
        ${element.style.cssText}
    `;

    return element;
}

function createStyledElement(tag, styles, innerHTML) {
    const element = document.createElement(tag);
    if (styles) {
        element.style.cssText = `
            ${fontStyles}
            ${styles}
        `;
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}


function createOutlineBadge(label, value) {
    const badge = createStyledElement("span", `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ddd;
        color: #555;
        padding: 6px 12px;
        border-radius: 12px;
        font-size: 0.9em;
        font-weight: bold;
        background-color: transparent;
        transition: background-color 0.3s ease, color 0.3s ease;
    `, `${label}: ${value}`);

    // Hover effect
    badge.onmouseover = () => {
        badge.style.backgroundColor = "#f0f0f0";
        badge.style.color = "#333";
    };
    badge.onmouseout = () => {
        badge.style.backgroundColor = "transparent";
        badge.style.color = "#555";
    };

    return badge;
}


function renderTopAnswerForQuestion(answers) {
    const answersContainer = createStyledElement("div", `
        display: block;
        margin-top: 20px;
    `);
   
    if (answers.length === 0) {
        const noAnswersMessage = createStyledElement("p", `
            font-style: italic;
            color: #888;
        `, "No answers available.");
        answersContainer.appendChild(noAnswersMessage);
    } else {
        answers.forEach(answer => {
            const answerDiv = createStyledElement("div", `
                padding: 12px;
                margin-bottom: 16px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #ffffff;
                box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
            `);
            
            const answerDate = formatDateString(answer.creation_date);
            const answeredDateDiv = createStyledElement("div", `
                font-size: 0.875em;
                color: #888;
            `, `
                <div style="display: flex; flex-wrap: wrap; justify-content: right;">
                    <span>Answered on ${answerDate}</span>
                </div>
            `); 

            const answerBody = createStyledElement("div", `
                padding: 10px;
                border-radius: 4px;
            `, answer.body);

            
            styleCodeBlocks(answerBody)

            const answerBadgesDiv = createStyledElement("div", `
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 1em;
                color: #555;
                flex-wrap: wrap;
            `);

             // Create badges for questions
            const scoreBadge = createOutlineBadge("Score", formatNumber(answer.score));
            const reputationBadge = createOutlineBadge("Reputation", formatNumber(answer.owner.reputation));

            answerBadgesDiv.appendChild(scoreBadge);
            answerBadgesDiv.appendChild(reputationBadge);

            // Create Accepted Answer badge if applicable
            if (answer.is_accepted) {
                const acceptedBadge = createStyledElement("span", `
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background-color: #e6ffed;
                    color: #28a745;
                    padding: 10px 10px;
                    margin-bottom: 5px;
                    border-radius: 5px;
                    font-weight: bold;
                    font-size: 0.9em;
                `, `    
                    Accepted Answer
                `);
                answerDiv.appendChild(acceptedBadge);
            }
            
            const actionsDiv = createStyledElement("div", `
                display: flex;
                margin-top: 10px;
                margin-bottom: 10px;
            `)
            const viewAnswerLink = styleOutlineButtonWithIcon(
                createStyledElement("a", "", ""),
                "See Answer",
                stackOverflowLogoSvg
            );
            viewAnswerLink.href = `https://stackoverflow.com/a/${answer.answer_id}`;
            viewAnswerLink.target = "_blank";
            actionsDiv.appendChild(viewAnswerLink);
            
            answerDiv.appendChild(answeredDateDiv);
            answerDiv.appendChild(answerBody);
            answerDiv.appendChild(answerBadgesDiv);
            answerDiv.appendChild(actionsDiv);

            answersContainer.appendChild(answerDiv);
        });
    }

    return answersContainer;
}

function renderTopAnswerForQuestion(answers) {
    const answersContainer = createStyledElement("div", `
        display: block;
        margin-top: 20px;
    `);
   
    if (answers.length === 0) {
        const noAnswersMessage = createStyledElement("p", `
            font-style: italic;
            color: #888;
        `, "No answers available.");
        answersContainer.appendChild(noAnswersMessage);
    } else {
        answers.forEach(answer => {
            const answerDiv = createStyledElement("div", `
                padding: 12px;
                margin-bottom: 16px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #ffffff;
                box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
            `);
            
            const answerDate = formatDateString(answer.creation_date);
            const answeredDateDiv = createStyledElement("div", `
                font-size: 0.875em;
                color: #888;
            `, `
                <div style="display: flex; flex-wrap: wrap; justify-content: right;">
                    <span>Answered on ${answerDate}</span>
                </div>
            `); 

            const answerBody = createStyledElement("div", `
                padding: 10px;
                border-radius: 4px;
            `, answer.body);

            
            styleCodeBlocks(answerBody)

            const answerBadgesDiv = createStyledElement("div", `
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 1em;
                color: #555;
                flex-wrap: wrap;
            `);

             // Create badges for questions
            const scoreBadge = createOutlineBadge("Score", formatNumber(answer.score));
            const reputationBadge = createOutlineBadge("Reputation", formatNumber(answer.owner.reputation));

            answerBadgesDiv.appendChild(scoreBadge);
            answerBadgesDiv.appendChild(reputationBadge);

            // Create Accepted Answer badge if applicable
            if (answer.is_accepted) {
                const acceptedBadge = createStyledElement("span", `
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background-color: #e6ffed;
                    color: #28a745;
                    padding: 10px 10px;
                    margin-bottom: 5px;
                    border-radius: 5px;
                    font-weight: bold;
                    font-size: 0.9em;
                `, `    
                    Accepted Answer
                `);
                answerDiv.appendChild(acceptedBadge);
            }
            
            const actionsDiv = createStyledElement("div", `
                display: flex;
                margin-top: 10px;
                margin-bottom: 10px;
            `)
            const viewAnswerLink = styleOutlineButtonWithIcon(
                createStyledElement("a", "", ""),
                "See Answer",
                stackOverflowLogoSvg
            );
            viewAnswerLink.href = `https://stackoverflow.com/a/${answer.answer_id}`;
            viewAnswerLink.target = "_blank";
            actionsDiv.appendChild(viewAnswerLink);
            
            answerDiv.appendChild(answeredDateDiv);
            answerDiv.appendChild(answerBody);
            answerDiv.appendChild(answerBadgesDiv);
            answerDiv.appendChild(actionsDiv);

            answersContainer.appendChild(answerDiv);
        });
    }

    return answersContainer;
}

async function render_stack_overflow_search_result(params, userSettings) {
    if (!userSettings || !userSettings.stackExchangeKey) {
        throw new Error("Oops! It looks like we're missing the Stack Exchange API key. Please check your settings and try again.");
    }
    
    const questionsDiv = createStyledElement("div", `
        border-radius: 8px;
        padding: 12px;
        margin: 20px 0;
    `);

    const query = encodeURIComponent(params.keyword);
    const response = await makeRequest(
        `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${query}&site=stackoverflow&filter=withbody&key=${userSettings.stackExchangeKey}`
    );

    if (response?.items?.length == 0) {
        console.error("No results found or there was an error in the response.");
        const noResultContainer = createStyledElement("div", `
            padding: 20px;
            text-align: center;
            font-size: 1.2em;
            color: #333;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
            max-width: 600px;    
        `);
        const noResultMessage = createStyledElement("p", `
            margin: 0;
            font-size: 1.25em;
            flex: 1;
        `, "No results found. Please try a different search query.");
        noResultContainer.appendChild(noResultMessage)
        return noResultContainer.innerHTML;
    }

    const questionDetails = response.items.map(item => ({
        title: item.title,
        body: item.body,
        link: item.link,
        upvoteCount: item.score,
        answerCount: item.answer_count,
        commentCount: item.comment_count || 0,
        dateCreated: formatDateString(item.creation_date),
        lastModified: item.last_edit_date ? formatDateString(item.last_edit_date) : null,
        questionId: item.question_id
    }));

    questionDetails.sort((a, b) => b.upvoteCount - a.upvoteCount || b.answerCount - a.answerCount || b.commentCount - a.commentCount);

    const topQuestions = questionDetails.slice(0, 3);
    questionIds = topQuestions.map(item => item.questionId);
    const topAnswers = await fetchTopAnswersThrottled(questionIds, userSettings.stackExchangeKey);
    
    topQuestions.forEach((question, index) => {
        const questionContainer = createStyledElement("div", `
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
        `);

        const questionTitle = createStyledElement("h3", `
            margin: 0;
            font-size: 1.25em;
            margin-bottom: 10px;
        `, question.title);
        
        const questionAskedDate = createStyledElement("div", `
            font-size: 0.875em;
            color: #888;
            margin-top: 5px;
            margin-bottom: 5px;           
        `, `
            <div style="display: flex; flex-wrap: wrap;">
                <span style="margin-right: 10px; margin-bottom: 5px;">Asked on ${question.dateCreated}</span>
                ${question.lastModified ? `<span style="margin-bottom: 5px;">Last updated on ${question.lastModified}</span>` : ""}
            </div>
        `); 
     
        const questionBadgesDiv = createStyledElement("div", `
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 1em;
            color: #555;
            flex-wrap: wrap;
        `);
      
        const upvoteBadge = createOutlineBadge("Upvotes", formatNumber(question.upvoteCount));
        const answerBadge = createOutlineBadge("Answers", formatNumber(question.answerCount));
        const commentBadge = createOutlineBadge("Comments", formatNumber(question.commentCount));

        questionBadgesDiv.appendChild(upvoteBadge);
        questionBadgesDiv.appendChild(answerBadge);
        questionBadgesDiv.appendChild(commentBadge);


        const viewQuestionBadgeLink = styleOutlineButtonWithIcon(
            createStyledElement("a", `margin-top: 10px;`, ""),
            "See Question",
            stackOverflowLogoSvg,
        );
        viewQuestionBadgeLink.href = question.link;
        viewQuestionBadgeLink.target = "_blank";
        
        questionContainer.appendChild(questionTitle);
        questionContainer.appendChild(questionAskedDate);
        questionContainer.appendChild(questionBadgesDiv);
        questionContainer.appendChild(viewQuestionBadgeLink)
        
        const answers = topAnswers[index]?.items ?? []
        const answersContainer = renderTopAnswerForQuestion(answers);
        questionContainer.appendChild(answersContainer);
        
        questionsDiv.appendChild(questionContainer);
    });

    return questionsDiv.innerHTML;
}
