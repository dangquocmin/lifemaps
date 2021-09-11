const getReferPeopleFromDB = () => {
  const r = localStorage.getItem("referPeople");
  if (r) {
    return JSON.parse(r);
  }
  return [];
};
export function setReferPeople(valueX) {
  let list = {};
  valueX.map((e, idx) => {
    if (list[e.id]) {
      list[e.id].push(idx);
    } else {
      list[e.id] = [idx];
    }
  });

  let r = [];
  for (let i in list) {
    r.push(valueX[list[i].pop()]);
  }

  localStorage.setItem("referPeople", JSON.stringify(r));
}

export async function getReferPeople(query) {
  const top100Films = getReferPeopleFromDB();

  await new Promise((r) => setTimeout(r, 1000));
  if (query) {
    return top100Films.filter((i) => {
      return (
        (i.name && i.name.indexOf(query)) ||
        (i.email && i.email.indexOf(query)) ||
        (i.position && i.position.indexOf(query))
      );
    });
  }
  return top100Films;
}

export async function addReferPeople(data) {
  data["id"] = Math.floor(Math.random() * 10000);
  let oldPeople = getReferPeopleFromDB();
  oldPeople.push(data);
  setReferPeople(oldPeople);
  await new Promise((r) => setTimeout(r, 1000));
}

export async function updateReferPeople(data) {
  let oldPeople = getReferPeopleFromDB();
  oldPeople.push(data);
  setReferPeople(oldPeople);
  await new Promise((r) => setTimeout(r, 1000));
}
