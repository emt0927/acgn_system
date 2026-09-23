
type keyType = 'username' | 'password' | 'newpassword' | 'nickname' | 'allpassword' | 'coverurl'
export interface settingConfig {
    label: string
    type: string
    key: keyType
}
export const formSchema: settingConfig[] = [{
    label: '头像',
    type: 'url',
    key: 'coverurl'
}, {
    label: '用户名',
    type: 'input',
    key: 'username'
}, {
    label: '昵称',
    type: 'input',
    key: 'nickname'
}, {
    label: '原密码',
    type: 'input',
    key: 'password'
}, {
    label: '新密码',
    type: 'input',
    key: 'newpassword'
}, {
    label: '确认新密码',
    type: 'input',
    key: 'allpassword'
}]