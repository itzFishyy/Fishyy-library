// Your teammates and friends, shown on the About page grouped by role.
//
// To add someone, copy one of the example lines below into the list
// (without the leading "//") and change the details:
//
//   { name: 'Alice', role: 'Web', url: 'https://alice.example.com' },
//   { name: 'Bob', role: 'Pwn', url: 'https://github.com/bob', note: 'Heap wizard' },
//   { name: 'Carol', role: 'Crypto' },
//
// - name: what to call them (required)
// - role: their CTF specialty, e.g. Web, Pwn, Crypto, Reverse, Forensics (required)
// - url:  link to their library, blog or profile (optional)
// - note: a short line shown next to their name (optional)
//
// People with the same role are grouped together. Roles appear in the
// order they first show up in this list. While the list is empty, the
// section shows "Have none yet :(".

export interface Friend {
  name: string;
  role: string;
  url?: string;
  note?: string;
}

export const friends: Friend[] = [
];
