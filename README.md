# fullstack-monitor-cli
View your logs from the Front-End and Back-End in one place.

```
sudo npm install -g fullstack-monitor-cli
```

## Commands
```
sudo fullstack-monitor-cli 

  Usage: fullstack-monitor-cli [options]

  Options:

    -h, --help                                Output usage information
    -t, --tutorial                            View a brief tutorial
    -s, --start                               Start the server
    -l, --listen                              Listen to the traffic in the terminal
    -c, --chrome                              Listen to the traffic in the chrome
    -k, --kill                                Kill the server
    -r, --restart                             Restart the server
    -sl, --start-listen                       Start the server and listen in the terminal
    -slc, --start-listen-chrome               Start the server and listen in the chrome browser
    -slb, --start-listen-both                 Start the server and listen in the terminal and chrome browser
  
  
  For more infomation view the project repo here:
  https://github.com/PFA-Pink-Fairy-Armadillo/fullstack-monitor-cli
  ```
  
  ## Tutorial
  ```
  sudo fullstack-monitor-cli -t

    - The basics -
    1. First start the server.
    2. Then listen to the server in the terminal.
    3. And/or listen to the server in the chrome browser.
    4. Then when you are done kill the server.

    $ fullstack-monitor-cli --start
    $ fullstack-monitor-cli --listen
    $ fullstack-monitor-cli --chrome
    $ fullstack-monitor-cli --kill

    - Start the server and listen in one command -
    1. Run the --start-listen command.

    $ fullstack-monitor-cli --start-listen
      OR
    $ fullstack-monitor-cli -sl
  ```
