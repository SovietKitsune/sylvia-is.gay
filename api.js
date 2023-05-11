const user = "TheConartist"
const route = "https://en.pronouns.page/api/profile/get/"

let order = [
   "dice-d20",
   "jokingly",
   "close",
   "dragon",
   "meh",
   "no"
]

let getProfile = async () => {
   let res = await fetch(`${route}${user}?version=2`)
   let body = await res.json()

   return body.profiles.en
}

let populate = async () => {
   let profile = await getProfile();

   let autoPopulate = ["names", "pronouns"]

   autoPopulate.forEach((field) => {
      let elm = document.getElementById(field)
      let data = profile[field]

      let values = {}
      let longest = 0

      data.forEach((val) => {
         let op = val.opinion
         if (!values[op]) {
            values[op] = []
         }

         let value = val.value

         if (value.includes("/")) {
            let split = value.split("/")
            let pronoun = split[split.length - 1]

            values[op].push(`<a href="${value}">${pronoun}</a>`)
         } else {
            values[op].push(value)
         }

         if (values[op].length > longest) {
            longest = values[op].length
         }
      })

      for (let i = 0; i < longest; i++) {
         let tr = document.createElement("tr")

         order.forEach((col) => {
            let td = document.createElement("td")

            td.innerHTML = values[col] ? values[col][i] || "" : ""

            tr.appendChild(td)
         })

         elm?.appendChild(tr)
      }
   })

   let desc = document.getElementById("desc")

   // @ts-ignore
   desc.innerText = profile.description
}

document.addEventListener("DOMContentLoaded", () => {
   populate()
      .then(() => console.log("Loaded!"))
      .catch((err) => console.error(`Failed to load: ${err}`))
})
