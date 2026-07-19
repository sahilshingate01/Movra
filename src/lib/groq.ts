import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'MISSING_API_KEY',
});

export async function generateChatResponse(
  systemInstruction: string,
  history: { role: 'user' | 'model'; text: string }[],
  message: string
) {
  try {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemInstruction }
    ];

    if (history && history.length > 0) {
      history.forEach(h => {
        messages.push({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.text,
        });
      });
    }

    messages.push({ role: 'user', content: message });

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    return {
      text: completion.choices[0]?.message?.content || 'I am sorry, I am unable to process that request right now.',
      success: true,
    };
  } catch (error) {
    console.error('Groq API Error:', error);
    return {
      text: 'Sorry, the Stadium AI assistant is currently experiencing high load. Please try again in a moment.',
      success: false,
    };
  }
}
