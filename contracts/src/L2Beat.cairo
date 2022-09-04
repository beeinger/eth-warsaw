%lang starknet
%builtins pedersen range_check ecdsa bitwise

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin

from starkware.cairo.common.uint256 import Uint256
from starkware.cairo.common.hash_state import hash_felts
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import split_felt


from starkware.starknet.common.syscalls import get_caller_address

from openzeppelin.token.erc721.library import ERC721

@external
func mint{
        syscall_ptr: felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(block_id: felt, txns_range_start: felt, txns_range_end: felt):
    alloc_locals

    let (local input) = alloc()

    assert input[0] = block_id
    assert input[1] = txns_range_start
    assert input[2] = txns_range_end

    let (local token_hash) = hash_felts{hash_ptr=pedersen_ptr}(input, 3)
    let (local high, low) = split_felt(token_hash)
    let (local caller) = get_caller_address()

    ERC721._mint(caller, Uint256(low, high))
    return ()
end



