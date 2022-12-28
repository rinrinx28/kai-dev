// import axios from "axios";
import fetch from "node-fetch";

export function getCollectionlist() {
  let post = { name: "collectionfind" };
  return fetch("https://kaigan.io/api/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }).then((res) => res.json());
}

export function getUser(account) {
  let post = { name: "user", wallet: account };
  return fetch("https://kaigan.io/api/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }).then((res) => res.json());
}

export function getCollectionstt(contract) {
  let post = { name: "collectionstt", contract_adr: contract };
  return fetch("https://kaigan.io/api/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }).then((res) => res.json());
}

// API opensea
export function getCollectionnew(contract) {
  return fetch(`https://api.opensea.io/api/v1/collection/${contract}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "406cb77152e84d318ec2075bb9d2f825",
    },
  }).then((res) => res.json());
}

export function getListed(slug) {
  let post = { name: "listed", collection_slug: slug };
  return fetch("https://kaigan.io/api/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }).then((res) => res.json());
}

export function getSold(slug, type) {
  let post = { name: "sold", collection_slug: slug, type: type };
  return fetch("https://kaigan.io/api/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }).then((res) => res.json());
}
