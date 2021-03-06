package v1

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/auxpi/auxpiAll"
	"github.com/auxpi/auxpiAll/e"
	"github.com/auxpi/bootstrap"
	"github.com/auxpi/controllers/api/base"
	"github.com/auxpi/log"
	"github.com/auxpi/models"
	"github.com/auxpi/utils"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/validation"
)

type Auth struct {
	base.ApiController
}

type adminAuthInfo struct {
	Username string `valid:"Required; MaxSize(32); Match(/^[\\w]{5,32}$/)" form:"username"`
	Password string `valid:"Required; MaxSize(32); MinSize(6);" form:"password"`
}

type UserAuthInfo struct {
	Email    string `valid:"Required; MaxSize(32); Email" form:"email"`
	Password string `valid:"Required; MaxSize(32); MinSize(6);" form:"password"`
}

type UserRegister struct {
	UserName    string `valid:"Required; MaxSize(32); MinSize(5);Match(/^[\\w]{5,32}$/)" form:"name" json:"user_name"`
	Email       string `valid:"Required; MaxSize(32); Email" form:"email" json:"email"`
	Password    string `valid:"Required; MaxSize(32); MinSize(6);" form:"password" json:"password"`
	CreatedTime int64  `json:"created_time"`
}

type UserMsg struct {
	AlertType     string
	AlertContent  string
	ButtonType    string
	ButtonContent string
	Link          string
}

type UserForget struct {
	Email       string `valid:"Required;MaxSize(32);Email" form:"email" json:"email"`
	CreatedTime int64  `json:"created_time"`
}

type UserReset struct {
	Password string `valid:"Required; MaxSize(32); MinSize(6);" form:"password" json:"password"`
	Token    string `valid:"Required;" form:"reset" json:"token"`
}

var xrsa, _ = utils.NewXRsa()

var site = auxpi.SiteBase{}

func init() {
	err := site.UnmarshalJSON([]byte(models.GetOption("site_base", "conf")))
	if err != nil {
		auxpiLog.SetAWarningLog("CONTROLLER", err)
	}
}

func (a *Auth) commonStyle() {
	a.LayoutSections = make(map[string]string)
	a.LayoutSections["Header"] = "auth/header.tpl"
	a.LayoutSections["Footer"] = "auth/footer.tpl"
	a.Data["xsrf_token"] = a.XSRFToken()
	a.Layout = "auth/base.tpl"
	a.TplName = "auth/base.tpl"
	a.Data["SiteName"] = site.SiteName
	a.Data["Time"] = beego.Date(time.Now(), "Y")
	a.Data["SiteLink"] = site.SiteUrl
	a.Data["Logo"] = site.Logo
}

//???????????????
func (a *Auth) GetAuthByUserName() {
	info := adminAuthInfo{}
	code := e.INVALID_PARAMS
	if err := a.ParseForm(&info); err != nil {
		//TODO :??????????????????
		auxpiLog.SetAWarningLog("ADMIN_LOGIN", err)
	}
	valid := validation.Validation{}
	ok, _ := valid.Valid(&info)
	logs.Alert(info)
	data := make(map[string]interface{})
	if ok {
		cc, _ := xrsa.PublicEncrypt(info.Password)
		beego.Alert(len(cc))
		isExist := models.CheckAdminAuth(info.Username, utils.GetSha256CodeWithSalt(info.Password))
		beego.Alert(utils.GetSha256CodeWithSalt(info.Password))
		if isExist {
			if email, _ := models.GetUserEmail(info.Username); email != "" {
				token, err := utils.GenerateToken(info.Username, email)

				if err != nil {
					code = e.ERROR_AUTH_TOKEN
				} else {
					data["token"] = token

					code = e.SUCCESS
				}
			}
		} else {
			logs.Alert("hello")
			code = e.ERROR_AUTH
		}
	} else {
		for _, errs := range valid.Errors {
			logs.Debug(errs.Value)
		}
	}
	resp := &auxpi.RespJson{
		code,
		e.GetMsg(code),
		data,
	}
	a.Data["json"] = resp
	a.ServeJSON()

}

//??????????????????
func (a *Auth) Show() {
	a.commonStyle()
	a.LayoutSections["Content"] = "auth/login.tpl"
	a.Data["Action"] = "login"
	a.Data["Part"] = "??????"

}

//??????????????????
func (a *Auth) Store() {
	userInfo := &UserAuthInfo{}
	if err := a.ParseForm(userInfo); err != nil {
		auxpiLog.SetAWarningLog("USER_LOGIN", err)
		a.ajaxErrorResp()
		return
	}
	valid := validation.Validation{}
	ok, _ := valid.Valid(userInfo)
	if !ok {
		a.ajaxErrorResp()
		return
	}

	//????????????
	beego.Alert([]byte(userInfo.Password))
	beego.Alert(userInfo.Password)
	userInfo.Password = utils.GetSha256CodeWithSalt(userInfo.Password)
	beego.Alert(userInfo)
	//????????????????????????
	user, status := models.CheckAndGetUser(userInfo.Email, userInfo.Password)
	//????????????????????????
	if status {
		userCookie := auxpi.AuxpiCookie{
			UName:      user.Username,
			ID:         user.ID,
			Email:      user.Email,
			Version:    strconv.Itoa(int(user.Version)),
			AuxpiToken: utils.GetMd5CodeWithSalt(user.Email),
		}

		sName := `_email_` + userCookie.Email +
			`_user_` + userCookie.UName +
			`_id_` + strconv.Itoa(user.ID) +
			`_version_` + userCookie.Version

		a.SetSession(sName, userCookie.AuxpiToken)
		a.Ctx.SetSecureCookie(bootstrap.SiteConfig.AuxpiSalt, "uname", userCookie.UName, "/")
		a.Ctx.SetSecureCookie(bootstrap.SiteConfig.AuxpiSalt, "email", userCookie.Email, "/")
		a.Ctx.SetCookie("id", strconv.Itoa(user.ID), "/")
		a.Ctx.SetCookie("v", userCookie.Version, "/")
		a.Ctx.SetSecureCookie(bootstrap.SiteConfig.AuxpiSalt, "at", userCookie.AuxpiToken, "/")

		if user.RoleID == 1 {
			//????????????????????????,??????????????? cookie
			a.Ctx.SetSecureCookie(bootstrap.SiteConfig.AuxpiSalt, "r", "admin", "/")
			//?????????????????? jwt ??? cookie
			token, err := utils.GenerateToken(userCookie.UName, userCookie.Email)
			if err != nil {
				auxpiLog.SetAnErrorLog("USER_LOGIN_ADMIN_JWt", err)
			}
			a.Ctx.SetCookie("Admin-Token", token, "/")
		}

		if a.Ctx.Input.IsAjax() {
			a.Data["json"] = &auxpi.RespJson{
				Code: e.SUCCESS,
				Msg:  e.GetMsg(e.SUCCESS),
			}
			auxpiLog.SetUserLogin(sName + `_token_` + userCookie.AuxpiToken)
			a.ServeJSON()
			return
		}

		a.Redirect("/user/index", http.StatusFound)
		return
	}

	a.Data["json"] = &auxpi.RespJson{
		Code: e.ERROR_USER_LOGIN,
		Msg:  e.GetMsg(e.ERROR_USER_LOGIN),
	}

	a.ServeJSON()

}

//??????????????????
func (a *Auth) Destroy() {
	sid := a.Ctx.GetCookie("id")
	id, _ := strconv.Atoi(sid)
	at, _ := a.Ctx.GetSecureCookie(bootstrap.SiteConfig.AuxpiSalt, "at")
	un, _ := a.Ctx.GetSecureCookie(bootstrap.SiteConfig.AuxpiSalt, "uname")
	em, _ := a.Ctx.GetSecureCookie(bootstrap.SiteConfig.AuxpiSalt, "email")

	var userCookie = auxpi.AuxpiCookie{
		UName:      un,
		Email:      em,
		ID:         id,
		Version:    a.Ctx.GetCookie("v"),
		AuxpiToken: at,
	}

	var sName = `_email_` + userCookie.Email +
		`_user_` + userCookie.UName +
		`_id_` + sid +
		`_version_` + userCookie.Version

	a.DelSession(sName)

	a.Ctx.SetCookie("uname", "", -1)
	a.Ctx.SetCookie("email", "", -1)
	a.Ctx.SetCookie("id", "", -1)
	a.Ctx.SetCookie("v", "", -1)
	a.Ctx.SetCookie("at", "", -1)
	a.Ctx.SetCookie("r", "", -1)

	if a.Ctx.GetCookie("Admin-Token") != "" {
		a.Ctx.SetCookie("r", "", -1)
		a.Ctx.SetCookie("Admin-Token", "", -1)
	}
	beego.Alert("Logout Done")
	a.Ctx.Redirect(302, "/")
}

//??????????????????
func (a *Auth) Forgot() {
	a.commonStyle()
	a.LayoutSections["Content"] = "auth/forgot.tpl"
	a.Data["Action"] = "forgot"
	a.Data["Part"] = "????????????"
}

//????????????(?????????)
func (a *Auth) DoForgot() {
	forgetInfo := &UserForget{}
	if err := a.ParseForm(forgetInfo); err != nil {
		a.ajaxErrorResp()
		return
	}
	valid := validation.Validation{}
	ok, _ := valid.Valid(forgetInfo)
	if !ok {
		a.ajaxErrorResp()
		return
	}
	//????????????
	if user, status := models.GetUserInfoByEmail(forgetInfo.Email); status {
		//????????????
		mailTo := []string{
			forgetInfo.Email,
		}
		//??????
		forgetInfo.CreatedTime = time.Now().Unix()
		jb, _ := json.Marshal(&forgetInfo)
		token, err := xrsa.PublicEncrypt(string(jb))
		if err != nil {
			auxpiLog.SetAnErrorLog("RSA_ENC", err)
			return
		}
		a.Data["json"] = &auxpi.RespJson{
			Code: e.SUCCESS,
			Msg:  e.GetMsg(e.SUCCESS),
		}
		a.ServeJSON()
		//???????????????"Hello"
		subject := "?????????" + user.Username + "?????????????????????" + bootstrap.SiteConfig.SiteName + "?????????"
		body := utils.RenderMail("reset.tpl", site, "reset", token)
		//????????????
		go utils.SendMail(mailTo, subject, body, site)
		return
	}
	if a.IsAjax() {
		a.Data["json"] = &auxpi.RespJson{
			Code: e.ERROR_USER_NOT_EXIST,
			Msg:  e.GetMsg(e.ERROR_USER_NOT_EXIST),
		}
		a.ServeJSON()
		return
	}
	return

}

//????????????
func (a *Auth) Reset() {
	a.commonStyle()
	a.LayoutSections["Content"] = "auth/reset.tpl"
	a.Data["Action"] = "reset"
	logs.Alert(a.Ctx.Input.Param(":token"))
	a.Data["resetToken"] = a.Ctx.Input.Param(":token")
	a.Data["Part"] = "????????????"
}

//??????????????????
func (a *Auth) DoReset() {
	resetInfo := UserReset{}
	if err := a.ParseForm(&resetInfo); err != nil {
		beego.Alert("aaaaa")
		a.ajaxErrorResp()
		return
	}

	valid := validation.Validation{}
	ok, _ := valid.Valid(&resetInfo)
	if !ok {

		a.ajaxErrorResp()
		return
	}

	//???????????? token
	token, err := xrsa.PrivateDecrypt(resetInfo.Token)
	if err != nil {
		logs.Alert(err)
		if a.IsAjax() {
			a.Data["json"] = &auxpi.RespJson{
				Code: e.ERROR_USER_RESET_TOKEN,
				Msg:  e.GetMsg(e.ERROR_USER_RESET_TOKEN),
			}
			a.ServeJSON()
			return
		}
		return
	}
	//??????????????????
	info := UserForget{}
	err = json.Unmarshal([]byte(token), &info)
	if err != nil {
		beego.Alert(err)
		a.ajaxErrorResp()
		return
	}
	//??????????????????????????????
	if info.CreatedTime-time.Now().Unix() > 3600 {
		if a.IsAjax() {
			a.Data["json"] = auxpi.RespJson{
				Code: e.ERROR_USER_RESET_TOKEN,
				Msg:  e.GetMsg(e.ERROR_USER_RESET_TOKEN),
			}
			a.ServeJSON()
			return
		}
		return
	}

	status := models.ResetUserPass(info.Email, utils.GetSha256CodeWithSalt(resetInfo.Password))

	if status {
		if a.IsAjax() {
			a.Data["json"] = auxpi.RespJson{
				Code: e.SUCCESS,
				Msg:  e.GetMsg(e.SUCCESS),
			}
			a.ServeJSON()
			return
		}
		return
	}

	if a.IsAjax() {
		a.Data["json"] = auxpi.RespJson{
			Code: e.ERROR,
			Msg:  e.GetMsg(e.ERROR),
		}
		a.ServeJSON()
		return
	}
	return

}

//????????????
func (a *Auth) Register() {
	if !bootstrap.SiteConfig.AllowRegister {
		a.commonStyle()
		a.LayoutSections["Content"] = "auth/msg.tpl"
		a.Data["action"] = "register"
		a.Data["Msg"] = &UserMsg{
			AlertType:     "warning",
			AlertContent:  "????????????????????????",
			ButtonType:    "primary",
			ButtonContent: "????????????",
			Link:          site.SiteUrl,
		}
		a.Data["Part"] = "???????????????"
		return
	}

	token := a.Ctx.Input.Param(":token")
	if a.Ctx.Input.Param(":token") == "" {
		if a.IsAjax() {
			a.ServeJSON()
			return
		}
		a.commonStyle()
		a.LayoutSections["Content"] = "auth/register.tpl"
		a.Data["Action"] = "register"
		a.Data["Part"] = "??????"
		return
	}
	//?????? token
	js, err := xrsa.PrivateDecrypt(token)
	if err != nil {
		//?????????????????????????????????
		a.commonStyle()
		a.LayoutSections["Content"] = "auth/msg.tpl"
		a.Data["action"] = "register"
		a.Data["Msg"] = &UserMsg{
			AlertType:     "warning",
			AlertContent:  "Token????????????",
			ButtonType:    "primary",
			ButtonContent: "????????????",
			Link:          bootstrap.SiteConfig.SiteUrl,
		}
		a.Data["Part"] = "????????????"
		return
	}
	//??????????????????
	info := &UserRegister{}
	err = json.Unmarshal([]byte(js), info)
	if err != nil {
		a.commonStyle()
		a.LayoutSections["Content"] = "auth/msg.tpl"
		a.Data["action"] = "register"
		a.Data["Msg"] = &UserMsg{
			AlertType:     "danger",
			AlertContent:  "????????????????????????",
			ButtonType:    "primary",
			Link:          bootstrap.SiteConfig.SiteUrl,
			ButtonContent: "????????????",
		}
		a.Data["Part"] = "????????????"
		return
	}
	//?????????????????????????????????
	if info.CreatedTime-time.Now().Unix() > 3600 {
		//????????????
		a.commonStyle()
		a.LayoutSections["Content"] = "auth/msg.tpl"
		a.Data["action"] = "register"
		a.Data["Msg"] = &UserMsg{
			AlertType:     "danger",
			AlertContent:  "??????Token ??????????????????????????????",
			ButtonType:    "primary",
			ButtonContent: "????????????",
			Link:          bootstrap.SiteConfig.SiteUrl,
		}
		a.Data["Part"] = "????????????"
		return

	}
	//????????????????????????????????????

	//??????????????????????????????????????????
	status := models.RegisterUser(info.UserName, info.Email, info.Password, beego.Substr(token, 0, 32))

	if status {
		a.commonStyle()
		a.LayoutSections["Content"] = "auth/msg.tpl"
		a.Data["action"] = "register"
		a.Data["Msg"] = &UserMsg{
			AlertType:     "success",
			AlertContent:  "????????????~",
			ButtonType:    "primary",
			ButtonContent: "????????????",
			Link:          bootstrap.SiteConfig.SiteUrl + "users/index",
		}
		a.Data["Part"] = "????????????"
		return
	}

	a.commonStyle()
	a.LayoutSections["Content"] = "auth/msg.tpl"
	a.Data["action"] = "register"
	a.Data["Msg"] = &UserMsg{
		AlertType:     "warning",
		AlertContent:  "???????????????????????????",
		ButtonType:    "primary",
		ButtonContent: "????????????",
		Link:          bootstrap.SiteConfig.SiteUrl,
	}
	a.Data["Part"] = "????????????"

}

//????????????
func (a *Auth) DoRegister() {
	if !bootstrap.SiteConfig.AllowRegister {
		a.Data["json"] = &auxpi.RespJson{
			Code: 500,
			Msg:  "???????????????????????????~",
		}
		a.ServeJSON()
		return
	}

	registerInfo := &UserRegister{}
	if err := a.ParseForm(registerInfo); err != nil {
		auxpiLog.SetAWarningLog("USER_REGISTER", err)
		a.ajaxErrorResp()
		return
	}

	valid := validation.Validation{}

	ok, err := valid.Valid(registerInfo)
	if err != nil {
		auxpiLog.SetAnErrorLog("REGISTER_VALID", err)
		return
	}

	if !ok {
		msg := `?????????????????????????????????:<br><li>????????????????????????,??????,???????????????</li><li>????????????5??????32?????????</li><li>?????????5??????32??????</li><li>??????????????????</li>`
		a.Data["json"] = &auxpi.RespJson{
			Code: 500,
			Msg:  "???????????????",
			Data: msg,
		}
		a.ServeJSON()
		return
	}

	//???????????????????????????????????????
	registerInfo.CreatedTime = time.Now().Unix()
	registerInfo.Password = utils.GetSha256CodeWithSalt(registerInfo.Password)

	jb, _ := json.Marshal(registerInfo)
	js := string(jb)

	//token ???????????????????????????????????????????????????????????????
	token, err := xrsa.PublicEncrypt(js)
	if err != nil {
		logs.Alert(err)
		return
	}

	//????????????
	result := models.CanUserRegister(registerInfo.UserName, registerInfo.Email)

	if !result {
		if a.IsAjax() {
			a.Data["json"] = &auxpi.RespJson{
				Code: e.ERROR_USER_ALREADY_EXIST,
				Msg:  e.GetMsg(e.ERROR_USER_ALREADY_EXIST),
			}
			a.ServeJSON()
			return
		}
		return
	}

	a.Data["json"] = &auxpi.RespJson{
		Code: e.SUCCESS,
		Msg:  e.GetMsg(e.SUCCESS),
	}
	a.ServeJSON()

	//?????????????????????????????????????????????
	if !bootstrap.SiteConfig.MailConfig.Status {
		apiToken := bootstrap.GetRandomString(32, `ZXCVBNMLKJHGFDSA_POIUYREWQ1234567890mnbvcxzasdfghjklpoiuytrewq`)
		models.RegisterUser(registerInfo.UserName, registerInfo.Email, registerInfo.Password, apiToken)
		return
	}
	//????????????????????????

	//???????????????
	mailTo := []string{
		registerInfo.Email,
	}
	//???????????????"Hello"
	subject := "????????????" + bootstrap.SiteConfig.SiteName
	// ????????????
	body := utils.RenderMail("register.tpl", site, "register", token)
	//????????????
	go utils.SendMail(mailTo, subject, body, site)

}

//??????????????????
func (a *Auth) RestUserPass() {
	models.ResetUserPass("admin", utils.GetSha256CodeWithSalt("zxcvbnm123"))
}

//??????????????????
func (a *Auth) Msg() {
	a.commonStyle()
	a.LayoutSections["Content"] = "auth/msg.tpl"
	a.Data["Action"] = "msg"
}

//ajax ??????????????????
func (a *Auth) ajaxErrorResp() bool {
	if a.IsAjax() {
		a.Data["json"] = &auxpi.RespJson{
			Code: e.INVALID_PARAMS,
			Msg:  e.GetMsg(e.INVALID_PARAMS),
		}
		a.ServeJSON()
		return false
	}
	return true
}
