import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, FileText } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface PollQuestion {
  id: string;
  question: string;
  options: string[];
}

interface PollContentTabProps {
  onSendRequest: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const PollContentTab: React.FC<PollContentTabProps> = ({
  onSendRequest,
  isSubmitting,
}) => {
  const [polls, setPolls] = useState<PollQuestion[]>([
    {
      id: '1',
      question: '',
      options: ['', '', '', '']
    }
  ]);

  const [expandedPolls, setExpandedPolls] = useState<Record<string, boolean>>({
    '1': true
  });

  const addPoll = () => {
    if (polls.length >= 3) return;
    
    const newPoll: PollQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', '']
    };
    
    setPolls([...polls, newPoll]);
    setExpandedPolls(prev => ({
      ...prev,
      [newPoll.id]: true
    }));
  };

  const removePoll = (pollId: string) => {
    if (polls.length <= 1) return;
    
    setPolls(polls.filter(poll => poll.id !== pollId));
    setExpandedPolls(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[pollId];
      return newExpanded;
    });
  };

  const updatePollQuestion = (pollId: string, question: string) => {
    setPolls(polls.map(poll => 
      poll.id === pollId ? { ...poll, question } : poll
    ));
  };

  const updatePollOption = (pollId: string, optionIndex: number, value: string) => {
    setPolls(polls.map(poll => 
      poll.id === pollId 
        ? { 
            ...poll, 
            options: poll.options.map((option, index) => 
              index === optionIndex ? value : option
            )
          }
        : poll
    ));
  };

  const togglePollExpansion = (pollId: string) => {
    setExpandedPolls(prev => ({
      ...prev,
      [pollId]: !prev[pollId]
    }));
  };

  const getPollNumber = (pollId: string) => {
    return polls.findIndex(poll => poll.id === pollId) + 1;
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <FileText className="w-5 h-5" />
          Poll Content for Twitter
        </h3>
        <p className="text-sm text-gray-600">Create up to 3 poll questions with up to 4 options each</p>
      </div>

      <div className="space-y-4">
        {polls.map((poll, pollIndex) => (
          <Collapsible 
            key={poll.id} 
            open={expandedPolls[poll.id]} 
            onOpenChange={() => togglePollExpansion(poll.id)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-medium">Poll {getPollNumber(poll.id)}</span>
                {poll.question && (
                  <span className="text-sm text-gray-600 truncate max-w-48">
                    "{poll.question}"
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {polls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePoll(poll.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
                <ChevronDown 
                  className={cn(
                    "w-4 h-4 transition-transform", 
                    expandedPolls[poll.id] && "rotate-180"
                  )} 
                />
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3 space-y-4 px-4">
              {/* Poll Question */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Poll Question</Label>
                  <span className={cn(
                    "text-xs",
                    getCharacterCount(poll.question) > 150 ? "text-red-500" : "text-gray-500"
                  )}>
                    {getCharacterCount(poll.question)}/150
                  </span>
                </div>
                <Input
                  placeholder="Enter your poll question"
                  value={poll.question}
                  onChange={(e) => updatePollQuestion(poll.id, e.target.value)}
                  maxLength={150}
                  className={cn(
                    getCharacterCount(poll.question) > 150 && "border-red-500"
                  )}
                />
              </div>

              {/* Poll Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Poll Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {poll.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="space-y-1">
                      <Label className="text-xs text-gray-600">
                        Option {optionIndex + 1}
                        {optionIndex >= 2 && (
                          <span className="text-gray-400 ml-1">(Optional)</span>
                        )}
                      </Label>
                      <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updatePollOption(poll.id, optionIndex, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  💡 Options 3 and 4 are optional. Twitter polls can have 2-4 options.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Add Another Question Button */}
        {polls.length < 3 && (
          <Button
            type="button"
            variant="outline"
            onClick={addPoll}
            className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Question ({polls.length}/3)
          </Button>
        )}

        {polls.length >= 3 && (
          <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              Maximum 3 poll questions allowed. Remove a poll to add a new one.
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Poll Guidelines:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Each poll question can be up to 150 characters</li>
          <li>• Minimum 2 options required, maximum 4 options allowed</li>
          <li>• Clear, concise questions work best for engagement</li>
          <li>• Consider your audience when crafting options</li>
        </ul>
      </div>
    </div>
  );
};

export default PollContentTab;