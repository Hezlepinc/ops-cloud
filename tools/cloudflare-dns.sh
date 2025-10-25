#!/usr/bin/env bash
set -euo pipefail

# Required env vars:
# - CF_API_TOKEN
# - CF_ZONE_ID
# - DOMAIN (record name, e.g. example.com or sub.example.com)
# - CLOUDWAYS_IP (IPv4)

if [[ -z "${CF_API_TOKEN:-}" || -z "${CF_ZONE_ID:-}" || -z "${DOMAIN:-}" || -z "${CLOUDWAYS_IP:-}" ]]; then
  echo "Missing required env vars: CF_API_TOKEN, CF_ZONE_ID, DOMAIN, CLOUDWAYS_IP" >&2
  exit 1
fi

API=https://api.cloudflare.com/client/v4

# Try to find existing record
EXISTING_ID=$(curl -s -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  "${API}/zones/${CF_ZONE_ID}/dns_records?type=A&name=${DOMAIN}" | jq -r '.result[0].id // empty')

PAYLOAD=$(jq -nc --arg name "${DOMAIN}" --arg ip "${CLOUDWAYS_IP}" '{type:"A", name:$name, content:$ip, ttl:120, proxied:false}')

if [[ -n "${EXISTING_ID}" ]]; then
  curl -s -X PUT -H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json" \
    --data "${PAYLOAD}" \
    "${API}/zones/${CF_ZONE_ID}/dns_records/${EXISTING_ID}" | jq .
else
  curl -s -X POST -H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json" \
    --data "${PAYLOAD}" \
    "${API}/zones/${CF_ZONE_ID}/dns_records" | jq .
fi


