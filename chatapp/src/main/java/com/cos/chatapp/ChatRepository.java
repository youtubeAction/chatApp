package com.cos.chatapp;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;

import reactor.core.publisher.Flux;

public interface ChatRepository extends ReactiveMongoRepository<Chat, String>{

	
	@Tailable // 커서를 안닫고 계속 유지한다.
	@Query("{sender:?0, receiver:?1}")
	Flux<Chat> mFindBySender(String sender, String receiver);
	//flux response를 유지하며 계속 데이터가 흘려보내기 
	

	@Tailable // 커서를 안닫고 계속 유지한다.
	@Query("{ roomNum :?0}")
	Flux<Chat> mFindByRoomNum(Integer roomNum);

	
	
}
