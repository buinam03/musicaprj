<template>
    <UserSearchList v-model:query="query" :users="users"
        :title="profileUser ? `${profileUser.username}'s Following` : 'Following'"
        :subtitle="users ? `${users.length} ${users.length === 1 ? 'person' : 'people'}` : ''"
        placeholder="Search following..." empty-icon="fa-solid fa-users" empty-title="No Following Yet"
        :empty-message="`${profileUser ? profileUser.username : 'This user'} isn't following anyone yet.`"
        @search="runSearch" />
</template>

<script setup>
import { followApi } from '@/api';
import UserSearchList from '@/components/social/UserSearchList.vue';
import { useUserListSearch } from '@/components/social/useUserListSearch';

const toUsers = (items) => (items || []).map((item) => item.following).filter(Boolean);

const { profileUser, users, query, runSearch } = useUserListSearch({
    routeName: 'FollowingPage',
    listName: 'following',
    fetchAll: async (userId) => toUsers(await followApi.getFollowing(userId)),
    search: async (userId, username) => toUsers(await followApi.searchFollowing(userId, username)),
});
</script>
