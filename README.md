# pjup

Global node utility for interactively keeping your package.json up to date

    npm install -g pjup

Then from the root directory of any project with a package.json do:

    pjup


## Contribute

    git clone git@github.com:samartioli/pjup.git
    git checkout -b newBranch
    cd pjup
    npm link

To unlink

    npm unlink -g pjup

To test install

    npm install -g ./

Uninstall

    npm uninstall -g pjup

When done developing. push then do a pull request

    npm add . -A
    npm commit -m 'new stuff'
    npm push origin newBranch
    # go to ui and do a pull request


## npm and git flow

For my own memory

    npm version [version]
    npm publish
    #npm publish makes a git tag
    git push origin --tags
