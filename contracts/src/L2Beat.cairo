%lang starknet
%builtins pedersen range_check ecdsa bitwise

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin

from starkware.cairo.common.uint256 import Uint256


@storage_var
func _balanceOf(account : felt) -> (res : felt):
end

@storage_var
func _ownerOf(tokenId: felt) -> (owner: felt):
end

@storage_var
func _minted(block_number: felt, chunk_number: felt) -> (res: felt):
end

@view
func balanceOf{
        syscall_ptr: felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(owner: felt) -> (balance: Uint256):
    let (balance) = _balanceOf.read(owner)
    let res = Uint256(balance, 0)
    return (res)
end

@view
func ownerOf{
        syscall_ptr: felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(tokenId: Uint256) -> (owner: felt):
    let (owner) = _ownerOf.read(tokenId.low)
    return (owner)
end

@external
func mint{
        syscall_ptr: felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }():
    return ()
end



