export async function equipmentdata({
  id,
  search = "",
}: {
  id: string;
  search: string;
}) {
  try {
    const url = `http://localhost:3000/api/equipment?room=${id}&name=${search}`;
    console.log("URL : ",url, 'type = ', typeof(url))
    const response = await fetch(url);
    const fetchedData = await response.json();
    console.log(fetchedData)
    return fetchedData;
  } catch (error) {
    return error
  }
}
