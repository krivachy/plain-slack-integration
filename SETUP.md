# Setting up the Plain Slack app in 3 steps

## 1. Install the Slack app

<a href="https://slack.com/oauth/v2/authorize?scope=channels%3Ahistory%2Cchat%3Awrite%2Ccommands%2Cusers%3Aread%2Cusers%3Aread.email&amp;user_scope=&amp;redirect_uri=https%3A%2F%2Fplain-slack-integration-production.onrender.com%2Fslack%2Foauth_redirect&amp;client_id=5201178479941.5226688564182" style="align-items:center;color:#fff;background-color:#4A154B;border:0;border-radius:4px;display:inline-flex;font-family:Lato, sans-serif;font-size:18px;font-weight:600;height:56px;justify-content:center;text-decoration:none;width:276px"><svg xmlns="http://www.w3.org/2000/svg" style="height:24px;width:24px;margin-right:12px" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>Add to Slack</a>

## 2. Create an API key

1. Go to your [Plain workspace](https://app.plain.com?redirectToLastWorkspace=true)
2. Open **Settings** ➡️ **Machine users**
3. Create a new Machine user, you can name it anything you like (e.g. "Slack Support")
4. Create a new API key for the Machine user with the following permissions:
   - `customer:create`
   - `customer:edit`
   - `customer:read`
   - `timeline:create`
   - `timeline:edit`
   - `timeline:read`
   - `user:read`
   - `workspace:read`
5. Copy the API key and save it for the next step

## 3. Configure the API key

In your Slack workspace type the following command:

```
/plain configure <api key you just created>
```

---

🎉 That's it! You can now start using Plain from Slack. 🎉 