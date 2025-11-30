'use client';

import { useState } from 'react';
import Image from 'next/image';
import { deleteUserAndRecords } from '@/lib/adminService';
import type { AdminUser } from '@/lib/adminService';

interface AdminUsersTableProps {
  users: AdminUser[];
  loading: boolean;
  onUserDeleted: () => void;
}

export default function AdminUsersTable({ users, loading, onUserDeleted }: AdminUsersTableProps) {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete all records for ${userName || 'this user'}? This action cannot be undone.`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const success = await deleteUserAndRecords(userId);
      if (success) {
        alert('User and all records deleted successfully.');
        onUserDeleted();
      } else {
        alert('Failed to delete user. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedUsers = [...users].sort((a, b) => {
    const nameA = (a.name || a.email || '').toLowerCase();
    const nameB = (b.name || b.email || '').toLowerCase();
    return sortOrder === 'asc' 
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  if (loading) {
    return (
      <div className="content-stretch flex flex-col gap-[13px] items-start relative shrink-0 w-full">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-black tracking-[0.2px]">
          Users Table
        </p>
        <div className="bg-neutral-50 border border-[#eaeaea] border-solid h-[124px] relative rounded-[12px] shrink-0 w-full flex items-center justify-center">
          <p className="text-[#757575]">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-col gap-[13px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-black tracking-[0.2px]">
          Users Table ({users.length} users)
        </p>
        <button
          className="bg-[#212121] box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[11px] py-[6px] relative rounded-[20px] shrink-0 w-[179px] cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="relative shrink-0 size-[24px]">
            <Image
              src="/material-symbols_download-rounded.svg"
              alt="Download"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="content-stretch flex gap-[3px] items-center relative shrink-0">
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white tracking-[-0.12px]">
              Download Full report
            </p>
          </div>
        </button>
      </div>

      <div className="bg-neutral-50 border border-[#eaeaea] border-solid rounded-[12px] shrink-0 w-full overflow-hidden">
        <div className="content-stretch flex items-start overflow-x-auto relative w-full">
          {/* Table Header */}
          <div className="content-stretch flex h-[60px] items-start relative shrink-0 w-full">
            {/* S/N Header */}
            <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[60px] items-center justify-center px-[24px] py-[12px] relative shrink-0 w-[75px]">
              <p className="flex-[1_0_0] font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[12.41px] text-black whitespace-pre-wrap">
                S/N
              </p>
            </div>
            {/* User Name Header */}
            <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[60px] items-center px-[24px] py-[12px] relative shrink-0 flex-1">
              <button
                onClick={handleSort}
                className="flex items-center gap-2 cursor-pointer"
              >
                <p className="flex-[1_0_0] font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[12.41px] text-black whitespace-pre-wrap">
                  User Name
                </p>
                <div className="relative shrink-0 size-[10px]">
                  <Image
                    src="/mingcute_down-line.svg"
                    alt="Sort"
                    width={10}
                    height={10}
                    className="object-contain"
                  />
                </div>
              </button>
            </div>
            {/* User Email Header */}
            <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[60px] items-center px-[24px] py-[12px] relative shrink-0 w-[194px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12.41px] text-black">
                User Email
              </p>
            </div>
            {/* Total Records Header */}
            <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[60px] items-center px-[24px] py-[12px] relative shrink-0 w-[120px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12.41px] text-black w-[79px] whitespace-pre-wrap">
                TotalRecords
              </p>
            </div>
            {/* Actions Header */}
            <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r-0 border-solid border-t-0 box-border content-stretch flex h-[60px] items-center px-[24px] py-[12px] relative shrink-0 w-[189px]">
              <p className="flex-[1_0_0] font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[12.41px] text-black whitespace-pre-wrap">
                Actions
              </p>
            </div>
          </div>

          {/* Table Rows */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full max-h-[400px] overflow-y-auto">
            {sortedUsers.length === 0 ? (
              <div className="bg-white border-[#dadada] border-b border-l-0 border-r-0 border-solid border-t-0 box-border content-stretch flex h-[64px] items-center justify-center px-[24px] py-[12px] relative shrink-0 w-full">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#757575]">
                  No users found
                </p>
              </div>
            ) : (
              sortedUsers.map((user, index) => (
                <div key={user.id} className="content-stretch flex h-[64px] items-start relative shrink-0 w-full">
                  {/* S/N Cell */}
                  <div className="bg-white border-[#dadada] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[64px] items-center justify-center px-[24px] py-[12px] relative shrink-0 w-[75px]">
                    <p className="flex-[1_0_0] font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black whitespace-pre-wrap">
                      {index + 1}
                    </p>
                  </div>
                  {/* User Name Cell */}
                  <div className="bg-white border-[#dadada] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[64px] items-center justify-center px-[24px] py-[12px] relative shrink-0 flex-1">
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14.183px] text-black tracking-[0.1418px] w-[105px] whitespace-pre-wrap">
                      {user.name || user.email || 'N/A'}
                    </p>
                  </div>
                  {/* User Email Cell */}
                  <div className="bg-white border-[#dadada] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[64px] items-center justify-center px-[24px] py-[12px] relative shrink-0 w-[194px]">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black tracking-[0.14px] w-[143px] whitespace-pre-wrap">
                      {user.email || 'N/A'}
                    </p>
                  </div>
                  {/* Total Records Cell */}
                  <div className="bg-white border-[#dadada] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[64px] items-center justify-center px-[24px] py-[12px] relative shrink-0 w-[120px]">
                    <p className="flex-[1_0_0] font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px] whitespace-pre-wrap">
                      {user.record_count}
                    </p>
                  </div>
                  {/* Actions Cell */}
                  <div className="bg-white border-[#dadada] border-b border-l-0 border-r-0 border-solid border-t-0 box-border content-stretch flex gap-[3px] h-[64px] items-center px-[24px] py-[12px] relative shrink-0 w-[189px]">
                    <button
                      onClick={() => handleDelete(user.id, user.name || user.email || '')}
                      disabled={deletingUserId === user.id}
                      className="border border-[#d6d6d6] border-solid box-border content-stretch flex gap-[10px] h-[28px] items-center justify-center px-[8px] py-0 relative rounded-[6px] shrink-0 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                  <div className="relative shrink-0 size-[16px]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                    </svg>
                  </div>
                      <p className="font-['Helvetica_Neue:Italic',sans-serif] leading-[normal] not-italic relative shrink-0 text-[13.296px] text-black tracking-[-0.6648px]">
                        {deletingUserId === user.id ? 'Deleting...' : 'Delete all records'}
                      </p>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

