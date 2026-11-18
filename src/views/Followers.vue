<template>
    <UserSearchList v-model:query="query" :users="users"
        :title="profileUser ? `Followers of ${profileUser.username}` : 'Followers'"
        :subtitle="users ? pluralize(users.length, 'follower') : ''"
        placeholder="Search followers..." empty-icon="fa-solid fa-user-group" empty-title="No Followers Yet"
        :empty-message="`${profileUser ? profileUser.username : 'This user'} doesn't have any followers yet.`"
        @search="runSearch" />
</template>

<script setup>
import { followApi } from '@/api';
import { pluralize } from '@/utils/format';
import UserSearchList from '@/components/social/UserSearchList.vue';
import { useUserListSearch } from '@/components/social/useUserListSearch';

const toUsers = (items) => (items || []).map((item) => item.follower).filter(Boolean);

const { profileUser, users, query, runSearch } = useUserListSearch({
    routeName: 'FollowersPage',
    listName: 'followers',
    fetchAll: async (userId) => toUsers(await followApi.getFollowers(userId)),
    search: async (userId, username) => toUsers(await followApi.searchFollowers(userId, username)),
});
</script>
