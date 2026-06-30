# Testing

WordWise uses a CI pipeline defined in `.github/workflows/ci.yml`.

## CI Check: `lint-and-test`

The CI workflow runs on every push and pull request to the `main` branch:

1. **Checkout** repository
2. **Use Node.js 22** with npm cache
3. **Install dependencies** (`npm ci`)
4. **Check syntax** (`node --check server.js routes/word.js`)
5. **Start server and smoke-test API**:
   - Starts the Express server in background
   - Hits `/api/word` and validates the JSON response contains `word`, `definition`, and `partOfSpeech`
   - Hits `/` and checks the HTML contains "WordWise"
   - Shuts down the server

## Running Tests Locally

```bash
# Syntax check
node --check server.js routes/word.js

# Start server
node server.js &

# Smoke test the API
curl -s http://localhost:3000/api/word | python3 -c "
import sys, json
d = json.load(sys.stdin)
assert 'word' in d
assert 'definition' in d
assert 'partOfSpeech' in d
print(f'OK: {d[\"word\"]}')
"

# Smoke test the HTML
curl -s http://localhost:3000/ | grep -q 'WordWise' && echo 'HTML OK'

# Stop the server
kill %1
```
