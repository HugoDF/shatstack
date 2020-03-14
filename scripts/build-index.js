const fs = require("fs").promises;
const { pkg, pagesDir, indexPath } = require("./config");

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
function getCommit() {
  return process.env.REPOSITORY_URL && process.env.COMMIT_REF
    ? {
        url: `${process.env.REPOSITORY_URL}/commits/${process.env.COMMIT_REF}`,
        text: process.env.COMMIT_REF.slice(0, 6)
      }
    : {
        url: "",
        text: "develop"
      };
}
const hiddenPages = ["index", "thank-you"];
async function main() {
  const pagePaths = (await fs.readdir(pagesDir)).filter(
    n => n.endsWith(".html") && !hiddenPages.some(p => n.startsWith(p))
  );

  const pages = await Promise.all(
    pagePaths.map(async p => {
      const content = await fs.readFile(`${pagesDir}/${p}`, "utf8");
      const [title] = content.match(/(?<=<title>).*(?=<\/title>)/ims);
      return {
        title: title
          .replace("SHATstack - ", "")
          .trim()
          .replace(/\n/g, ""),
        path: p.replace(".html", "")
      };
    })
  );

  await fs.writeFile(indexPath, template(pages), "utf8");
}

const renderPagesToJSObj = pages =>
  pages
    .map(
      ({ title, path }) =>
        `{ title: ${JSON.stringify(title)}, path: '${path}' }`
    )
    .join(",\n");

function template(pages) {
  const commit = getCommit();
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="SHATstack - ${
      pkg.description
    }" />
    <title>SHATstack</title>
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@1.x.x/dist/tailwind.min.css"
      rel="stylesheet"
    />
    <!--
    <script
      src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@2.x.x/dist/alpine.min.js"
      defer
    ></script>
    -->
  </head>

  <body class="flex">
    <div
      x-data="page()"
      class="flex mx-auto md:w-2/3 flex-col items-center px-8 md:px-32 py-24"
    >
      <h2 class="text-xl font-semibold text-gray-900 mb-6">SHATstack</h2>
      <div class="text-xs text-gray-500 italic mb-6">Last update: <a
        class="text-teal-300 hover:text-teal-600 hover:underline"
        href="${commit.url}"
      >${commit.text}</a>
      </div>
      <p class="mb-4 w-full leading-relaxed">${
        pkg.description.split(':')[0]
      } by <a class="text-teal-500 hover:text-teal-800 hover:underline" href="https://codewithhugo.com/tags/alpinejs">Hugo</a></p>

      <ul class="list-inside mb-8 w-full leading-relaxed">
        The wonderful SHATstack (subset of the JAMstack), is comprised of:
          <li class="list-disc w-full">Serverless</li>
          <li class="list-disc w-full">HTML</li>
          <li class="list-disc w-full"><a
            href="https://github.com/alpinejs/alpine" class="text-teal-500 hover:text-teal-800 hover:underline"
            >Alpine.js
            </a>
          </li>
          <li class="list-disc w-full"><a href="https://tailwindcss.com/" class="text-teal-500 hover:text-teal-800 hover:underline"
            >TailwindCSS
            </a>
          </li>
      </ul>
      <p class="mb-4 w-full leading-relaxed">
        SHATStack, a Dumpster fire of a stack for people who have had enough of acronyms. It's back to the old times:
      </p>
      <p class="mb-4 w-full leading-relaxed">
        <strong>How do I create a new page?</strong>
        Create a HTML file, load up Alpine.js and Tailwind CSS from CDN and get coding.
      </p>
    </div>
    <!--
    <script>
      function page() {
        return {
          pages: [${renderPagesToJSObj(pages)}]
        }
      }
    </script>
    -->
  </body>
</html>`;
}
