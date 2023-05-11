# Setting up the Plain Slack app in 3 steps

## 1. Install the Slack app

<a href="https://slack.com/oauth/v2/authorize?scope=channels%3Ahistory%2Cchat%3Awrite%2Ccommands%2Cusers%3Aread%2Cusers%3Aread.email&amp;user_scope=&amp;redirect_uri=https%3A%2F%2Fplain-slack-integration-production.onrender.com%2Fslack%2Foauth_redirect&amp;client_id=5201178479941.5226688564182" target="_blank">
<img src="./img/add_to_slack_button.png">
</a>

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