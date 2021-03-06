import pkg from '@/../package.json';

export function shorten(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function jsonParse(input, fallback?) {
  if (typeof input !== 'string') {
    return fallback || {};
  }
  try {
    return JSON.parse(input);
  } catch (err) {
    return fallback || {};
  }
}

export function clone(item) {
  return JSON.parse(JSON.stringify(item));
}

export function lsSet(key: string, value: any) {
  return localStorage.setItem(`${pkg.name}.${key}`, JSON.stringify(value));
}

export function lsGet(key: string) {
  const item = localStorage.getItem(`${pkg.name}.${key}`);
  return jsonParse(item, '');
}

export function lsRemove(key: string) {
  return localStorage.removeItem(`${pkg.name}.${key}`);
}

export function formatProposal(proposal) {
  proposal.msg = jsonParse(proposal.msg, proposal.msg);

  // v0.1.0
  if (proposal.msg.version === '0.1.0') {
    proposal.msg.payload.start = 1595088000;
    proposal.msg.payload.end = 1595174400;
    proposal.msg.payload.snapshot = 10484400;
    proposal.bpt_voting_disabled = '1';
  }

  // v0.1.1
  if (proposal.msg.version === '0.1.0' || proposal.msg.version === '0.1.1') {
    proposal.msg.payload.metadata = {};
  }

  /*
  if (proposal.msg.payload.snapshot < 10000000)
    proposal.msg.payload.snapshot = 20000000;
  */

  return proposal;
}

export function formatProposals(proposals) {
  return Object.fromEntries(
    Object.entries(proposals).map(proposal => [
      proposal[0],
      formatProposal(proposal[1])
    ])
  );
}

export function filterNetworks(networks, spaces, q) {
  return Object.values(networks)
    .map((network: any) => {
      network.spaces = Object.entries(spaces)
        .filter((space: any) => space[1].chainId === network.chainId)
        .map(space => space[0]);
      return network;
    })
    .filter(network =>
      JSON.stringify(network)
        .toLowerCase()
        .includes(q.toLowerCase())
    )
    .sort((a, b) => b.spaces.length - a.spaces.length);
}
