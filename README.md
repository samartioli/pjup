# pjup

Global node utility for interactively keeping your package.json up to date

    npm install -g pjup

Then from the root directory of any project with a package.json do:

    pjup

# help

    pjup --help
    Usage: pjup [options]

    Options:
      -p, --prefix  new version prefix. only ~ or ^ supported          [default: ""]
      -h, --help    Show help

    Examples:
      /Users/sj/npm-global/bin/pjup
      /Users/sj/npm-global/bin/pjup -p ^     use caret before new versions
      /Users/sj/npm-global/bin/pjup -p \~    be sure to escape tilde


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
