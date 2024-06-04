### Tax exemption tool
# Tags explanation
1. CI/CD Set-Up - the CI/CD pipeline has been implemented: Week 2.
something 2

# Prerequisites
NodeJS and NPM installed on your local machine.

# How do I run this? On my local machine
Change directory into /FrontEnd
Then run:
  -- install project dependencies
  npm install
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  -- So you can import 'path' without errors:
  npm i -D @types/node
  -- Setup project. 'shadcn-ui' provides pre-made components, e.g. Buttons.
  npx shadcn-ui@latest init
  -- Actually launch the server.
  npm run dev
You can then access the server via localhost.
  
# Help! 'npx shadcn-ui@latest init' has a 'File Not Found' error, and I am on Windows!
Run: #npm install -g npm'
Your problem was that /Roaming/npm was not made yet.

#Add Button UI element to project
'npx shadcn-ui@latest add button'
'npm run dev'
works and I can access the website. On local machine
