#!/bin/bash

echo "🧪 MGNREGA Dashboard - API Test Suite"
echo "======================================"
echo ""

BASE_URL="http://localhost:3001/api"
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local name=$3
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        echo "✅ PASSED (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo "❌ FAILED (HTTP $http_code)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "Testing Backend API Endpoints:"
echo "-------------------------------"
echo ""

# Test all endpoints
test_endpoint "GET" "/states" "Get States"
test_endpoint "GET" "/districts" "Get All Districts"
test_endpoint "GET" "/districts/Bihar" "Get Districts for Bihar"
test_endpoint "GET" "/data/Bihar/Gaya" "Get Data for Gaya"
test_endpoint "GET" "/summary" "Get Summary Statistics"
test_endpoint "POST" "/seed" "Seed Sample Data"
test_endpoint "POST" "/fetch-mgnrega" "Fetch MGNREGA Data"

echo ""
echo "======================================"
echo "Test Results:"
echo "  ✅ Passed: $PASSED"
echo "  ❌ Failed: $FAILED"
echo "======================================"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 All tests passed! Backend is ready."
    exit 0
else
    echo "⚠️  Some tests failed. Check backend server."
    exit 1
fi
