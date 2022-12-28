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
  return fetch(`https://api.opensea.io/api/v1/asset_contract/${contract}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "406cb77152e84d318ec2075bb9d2f825",
    },
  }).then((res) => res.json());
}

// Update Collection Info

export function updateCollection(
  contract,
  featured_image_url,
  banner_image_url,
  external_url,
  discord_url,
  twitter_username,
  slug,
  collection_name,
) {
  let post = {
    name: "update_collection",
    contract: contract,
    featured_image_url: featured_image_url,
    banner_image_url: banner_image_url,
    external_url: external_url,
    discord_url: discord_url,
    twitter_username: twitter_username,
    slug: slug,
    collection_name: collection_name,
  };
  return fetch("https://kaigan.io/api/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
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

export function getSold(slug) {
  let post = { name: "sold", collection_slug: slug };
  return fetch("https://kaigan.io/api/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }).then((res) => res.json());
}
