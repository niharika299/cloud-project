const { escapeHTML, responses } = require('../script.js');

describe('Election Assistant Logic', () => {
    test('escapeHTML should safely escape special characters', () => {
        const input = '<script>alert("XSS & Attack")</script>';
        const expected = '&lt;script&gt;alert(&quot;XSS &amp; Attack&quot;)&lt;/script&gt;';
        expect(escapeHTML(input)).toBe(expected);
    });

    test('responses object should contain necessary keys', () => {
        expect(responses).toHaveProperty('timeline');
        expect(responses).toHaveProperty('register');
        expect(responses).toHaveProperty('process');
        expect(responses).toHaveProperty('default');
    });

    test('timeline response should have correct structure', () => {
        expect(responses.timeline.text).toBeDefined();
        expect(Array.isArray(responses.timeline.cards)).toBe(true);
    });
});
