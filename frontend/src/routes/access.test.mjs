import test from 'node:test'
import assert from 'node:assert/strict'
import { canAccessPage } from './access.mjs'

for (const role_name of ['admin', 'responsible', 'user']) {
  test(`Page permissions for ${role_name}`, () => {
    const user = { role_name, status: 'active' }
    assert.equal(canAccessPage(user, '/', '?section=items'), true)
    assert.equal(canAccessPage(user, '/admin'), role_name === 'admin')
    assert.equal(canAccessPage(user, '/', '?section=add-item'), role_name === 'responsible')
    assert.equal(canAccessPage(user, '/', '', 'responsible'), role_name === 'responsible')
  })
}
test('Missing, inactive, suspended and unknown roles are denied', () => {
  for (const user of [null, { role_name: 'admin', status: 'inactive' },
    { role_name: 'responsible', status: 'suspended' }, { role_name: 'unknown', status: 'active' }]) {
    assert.equal(canAccessPage(user, '/', '?section=items'), false)
  }
})
