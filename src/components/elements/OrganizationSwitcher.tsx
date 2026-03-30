import { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  Home, 
  Check, 
  PlusCircle, 
  Loader2 
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from 'react-i18next'

export function OrganizationSwitcher() {
  const { t } = useTranslation()
  const { currentOrg, setOrg } = useAuthStore()
  const [orgs, setOrgs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchOrgs = async () => {
    try {
      const res: any = await api.get('/organizations/me')
      setOrgs(res.data || [])
    } catch (err) {
      console.error('Failed to fetch organizations', err)
    }
  }

  useEffect(() => {
    fetchOrgs()
  }, [])

  const handleSwap = async (orgId: string) => {
    setLoading(true)
    try {
      const res: any = await api.post('/auth/swap-token', { orgId })
      // res is { message, data: { access_token, refresh_token, role, orgId, user? } }
      // We need to find the org name from our list
      const selectedOrg = orgs.find(o => o.id === orgId)
      if (selectedOrg) {
        setOrg({
          id: selectedOrg.id,
          name: selectedOrg.name,
          role: res.data.role
        })
      }
      window.location.reload() // Reload to apply new permissions and tokens
    } catch (err) {
      console.error('Failed to swap organization', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newOrgName.trim()) return
    setCreating(true)
    try {
      const res: any = await api.post('/organizations', { name: newOrgName })
      // res.data is the new organization object
      setIsCreateOpen(false)
      setNewOrgName('')
      await fetchOrgs()
      
      // Automatically swap to the new org
      if (res.data?.id) {
        await handleSwap(res.data.id)
      }
    } catch (err) {
      console.error('Failed to create organization', err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-4 border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={loading} variant="ghost" className="w-full justify-between h-auto py-2 px-2 hover:bg-accent/50 group">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (currentOrg?.name?.charAt(0) || <Home className="h-4 w-4" />)}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold truncate">{currentOrg?.name || t('org.select_title')}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {currentOrg?.role ? (currentOrg.role === 'ORG_ADMIN' ? t('org.role_admin') : t('org.role_member')) : t('org.context_global')}
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5">
            {t('org.my_orgs')}
          </DropdownMenuLabel>
          {orgs.length === 0 ? (
             <div className="px-2 py-4 text-center">
                <p className="text-xs text-muted-foreground">{t('org.no_orgs')}</p>
             </div>
          ) : (
            orgs.map((org) => (
              <DropdownMenuItem 
                key={org.id} 
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => handleSwap(org.id)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                    {org.name.charAt(0)}
                  </div>
                  <span className="truncate text-sm">{org.name}</span>
                </div>
                {currentOrg?.id === org.id && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))
          )}
          
          <DropdownMenuSeparator />
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer py-2 text-primary focus:text-primary focus:bg-primary/5 font-medium">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('org.create_new')}
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('org.create_title')}</DialogTitle>
                <DialogDescription>
                  {t('org.create_description')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('org.name_label')}</Label>
                  <Input 
                    id="name" 
                    placeholder={t('org.name_placeholder')}
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>{t('org.cancel')}</Button>
                <Button onClick={handleCreate} disabled={creating || !newOrgName.trim()}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('org.create_button')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
