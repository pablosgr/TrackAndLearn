export function formatPrompt(
    description: string,
    level: string,
    topic: string,
    adaptation: string | null,
    pdf: string | null
): string {
    const formattedPrompt = `
        Generate a multiple-choice test in valid JSON (no markdown, comments, or extra text) which follows these requirements:
          - Topic: ${topic}
          - Test content description: ${description}
          - Educational Level: ${level}
          - Adaptation: ${adaptation ? adaptation : 'None'}
          - 4 questions maximum
          - Each question: 2 or 4 options, 1 correct answer
          - Include a realistic time limit (minutes)
          ${pdf 
          ? '- Use the attached PDF as reference along with the description. Prioritize PDF content if it conflicts with the description, but do not reference PDF content directly' 
          : ''}
          - If adaptation exists, add an adapted version as an extra object in "tests" array. Set its "name" field to: <test_template_name> - <Adaptation acronym> adapted.
          - Keep "test_template_name" short (max. 4 words) and generic, without specific dates or educational level.
          Example structure (replace all example content with new relevant data):
            {
                "test_template_name": "Cubism",
                "tests": [
                    {
                        "name": "Cubism - Standard",
                        "time_limit": 15,
                        "questions": [
                            {
                                "question_text": "Who is the most renowned artist of Cubism?",
                                "options_number": 2,
                                "options": [
                                    { "option_text": "Francisco de Goya", "is_correct": false, "index_order": 1 },
                                    { "option_text": "Pablo Picasso", "is_correct": true, "index_order": 2 }
                                ],
                                "index_order": 1
                            },
                            {
                                "question_text": "What is one of the main characteristics of Cubism?",
                                "options_number": 2,
                                "options": [
                                    { "option_text": "Showing objects from different angles at the same time", "is_correct": true, "index_order": 1 },
                                    { "option_text": "Using very soft and blurry shapes", "is_correct": false, "index_order": 2 }
                                ],
                                "index_order": 2
                            }
                        ]
                    }
                ]
            }
    `;
    
    return formattedPrompt;
}
