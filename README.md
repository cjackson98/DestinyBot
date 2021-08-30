# DestinyUtil
**This project is a work in progress.**
My progress has slowed lately but I intend to continue working on it as I find time to do so.
</br>
</br>
</br>
**Website will not function without your custom clientId, apiKey, and clientSecret being set**

Bungie's Destiny 2 video game has a large number of third party tools to make various basic in game tasks faster/easier. This project combines the functionalities of few of the tools I use most often into one basic website.

https://cjackson98.github.io/DestinyUtil/

https://user-images.githubusercontent.com/43625472/131394270-02a11d02-287c-43a6-85f3-6faab5b74c90.mp4

<h3>Done:</h3>
  <ul>
    <li>OAuth Authorization</li>
    <li>OAuth Refresh capabilites</li>
    <li>Retrieve and display weapons & armor from Xur's inventory (when applicable).</li>
    <li>Retrieve and display daily armor mods from Ada-01's inventory.</li>
    <li>Basic functionality for retreiving Banshee-44's inventory (this used to be where armor mods were sold in game but this was changed recently and needs to be updated accordingly).</li>
    <li>Some basic CSS styling</li>
    <li>Added a "disabled" class for the buttons that greys them out and removes the "animation" when they are not available.</li>
    <li>Updated situations where multiple requests are made to correctly wait for a request to finish before proceeding to the next request (Updated to use Promise.all())</li>
    <li>Updated Banshee functionality to get weekly weapons being sold (rather than armor mods like in previous seasons).</li>
    <li>Automatically refresh access token when needed (previous functionality required user to click OAuth button).</li>
  </ul>
  
<h3>To do:</h3>
  <ul>
    <li>Clean up Xur inventory getter / make it look prettier</li>
    <li>Add functionality for getting/displaying armor stat rolls from Xur?</li>
    <li>Update Banshee/Ada request to use custom user profile/characters (current default just uses my profile and my main character).</li>
    <li>Update Banshee request to get weapon rolls (new to season 14) (these weapons update weekly)</li>
    <li>Site requires clientId, apiKey, and clientSecret to be set but due to being hosted on GitHub, these would all be publicly accessible. I want to try to find a way to keep these as private as possible.</li>
    <li>Add loading animation while requests are loading</li>
  </ul>
