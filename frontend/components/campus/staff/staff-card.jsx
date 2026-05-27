export function StaffMemberCard({ staff, onEdit, onDelete }){
    return (
        <Card className="overflow-hidden border-border/50 hover:border-primary/20 transition-colors shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <User className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="font-bold text-sm leading-none">{staff.name}</p>

                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                {staff.role}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={onEdit} className="h-7 w-7">
                            <Edit2 className="h-3.5 w-3.5" />
                        </Button>

                        <Button variant="ghost" size="icon-sm" onClick={onDelete} className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    {
                        staff.phone && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3" /> {staff.phone}
                            </div>
                        )
                    }

                    {staff.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {staff.email}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}