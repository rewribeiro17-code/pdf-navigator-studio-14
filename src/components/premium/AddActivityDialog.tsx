import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { FamilyMember } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: FamilyMember | null;
  onAddActivity: (activity: {
    title: string;
    description: string;
    duration: number;
    category: 'physical' | 'creative' | 'educational' | 'social' | 'family';
    icon: string;
    ageRange: [number, number];
  }) => void;
}

const categoryOptions = [
  { value: 'physical', label: 'Atividade Física', icon: '🏃' },
  { value: 'creative', label: 'Arte e Criatividade', icon: '🎨' },
  { value: 'educational', label: 'Educacional', icon: '📚' },
  { value: 'social', label: 'Social', icon: '👥' },
  { value: 'family', label: 'Família', icon: '👨‍👩‍👧‍👦' },
];

const iconsByCategory = {
  physical: ['🏃', '⚽', '🚴', '🏊', '🏀', '🎾', '🏐', '🤸', '🧗'],
  creative: ['🎨', '🎵', '🎭', '✏️', '🖌️', '📸', '🎪', '🎬', '🎯'],
  educational: ['📚', '🧪', '🔬', '📖', '✍️', '🧮', '🌍', '🔭', '💻'],
  social: ['👥', '🎲', '🎮', '🎯', '🃏', '🎳', '🎪', '🤝', '💬'],
  family: ['👨‍👩‍👧‍👦', '🍳', '🌳', '🏡', '🎉', '🎂', '🍕', '🎈', '💝'],
};

const AddActivityDialog: React.FC<AddActivityDialogProps> = ({
  open,
  onOpenChange,
  member,
  onAddActivity
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState([30]);
  const [category, setCategory] = useState<'physical' | 'creative' | 'educational' | 'social' | 'family'>('physical');
  const [selectedIcon, setSelectedIcon] = useState('🏃');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member || !title.trim() || !description.trim()) return;

    onAddActivity({
      title: title.trim(),
      description: description.trim(),
      duration: duration[0],
      category,
      icon: selectedIcon,
      ageRange: [Math.max(1, member.age - 2), member.age + 2], // Age range around member's age
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDuration([30]);
    setCategory('physical');
    setSelectedIcon('🏃');
    onOpenChange(false);

    toast({
      title: "Atividade criada!",
      description: `"${title}" foi adicionada às atividades de ${member.name}.`,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Atividade - {member.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Nome da Atividade</Label>
            <Input
              id="title"
              placeholder="Ex.: Pintura com aquarela"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-activity-title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva como realizar esta atividade..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-activity-description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(value: any) => {
              setCategory(value);
              setSelectedIcon(iconsByCategory[value][0]);
            }}>
              <SelectTrigger data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Ícone</Label>
            <div className="grid grid-cols-9 gap-2">
              {iconsByCategory[category].map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`text-2xl p-2 rounded border-2 hover:bg-gray-50 ${
                    selectedIcon === icon ? 'border-primary bg-primary/10' : 'border-gray-200'
                  }`}
                  data-testid={`icon-${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Duração: {formatDuration(duration[0])}</Label>
            <Slider
              value={duration}
              onValueChange={setDuration}
              max={180}
              min={15}
              step={15}
              className="w-full"
              data-testid="slider-duration"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>15min</span>
              <span>3h</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!title.trim() || !description.trim()}
              data-testid="button-save-activity"
            >
              Criar Atividade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityDialog;