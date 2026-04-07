#!/bin/bash
# API testing helper - gets session cookie and runs curl with it

SESSION_COOKIE=$(bun test_session.ts)

if [ -z "$1" ]; then
  echo "Usage: $0 <path> [curl-options...]"
  echo "Example: $0 /api/issues"
  exit 1
fi

curl -s -H "Cookie: $SESSION_COOKIE" "$@"
