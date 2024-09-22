# Stack Overflow Linker v1.0.0

This plugin helps you find relevant Stack Overflow questions and retrieves the best answers using the Stack Exchange API.

🔑 **Stack Exchange API Key Required**: 
Click the **Settings** tab and enter your Stack Exchange API key. To obtain a Stack Exchange API key:

1. **Sign In**: Log into your Stack Exchange account.
2. **Register App**: Visit the [Stack Apps registration](https://stackapps.com/apps/oauth/register) and fill out the form.
3. **Get Key**: Submit the form to receive your API key.

For details, follow the instructions in the [Stack Exchange API documentation](https://api.stackexchange.com/docs).

## Example Usage

- **Find out why this error is occurring:**
Blocked opening '<URL>' in a new window because the request was made in a sandboxed frame whose 'allow-popups' permission is not set

- **Can you check what might be causing this error?**
Uncaught SyntaxError: Cannot use import statement outside a module` when importing ECMAScript 6

## Limitations

- The Stack Exchange API allows up to **10,000 requests per day** per IP address. This limit is reset every 24 hours.